import datetime
import json
import os
import chess
import game
from flask import Flask, render_template, jsonify, request, make_response

app = Flask(__name__)
app.secret_key = "qwe123"


@app.route("/")
def index():
    uid()
    resp = make_response(render_template("index.html", board=game.board, game=game))
    if "id" not in request.cookies:
        resp.set_cookie("id", str(datetime.datetime.now()))
    return resp


@app.route("/move", methods=["POST"])
def move():
    user_move = request.form["user_move"]
    promotion = request.form["promotion"]
    try:
        move = chess.Move.from_uci(user_move)
    except ValueError:
        return jsonify({"message": "Invalid input", "status": "bad"})
    else:
        if game.board.is_legal(move):
            if game.board.is_en_passant(move):
                game.board.push_en_passant(move)
            elif promotion != "":
                game.board.push(
                    chess.Move(move.from_square, move.to_square, promotion.upper())
                )
            else:
                game.board.push(move)
        elif game.board.is_legal(chess.Move.from_uci(user_move + promotion)):
            game.board.push(chess.Move.from_uci(user_move + promotion))

        elif move is None:
            return jsonify({"message": "Something went wrong", "status": "bad"})
        else:
            return jsonify({"message": "Invalid move", "status": "bad"})

    if game.board.is_game_over():
        if game.board.is_checkmate():
            return jsonify({"message": "Game over, Checkmate", "status": "ok"})
        else:
            return jsonify({"message": "Game over, Stalemate", "status": "ok"})

    if game.algorithm == "alpha_betaMinMaxL":
        score, move = game.alpha_betaMinMaxL(
            game.board, game.level, float("-inf"), float("inf"), False
        )
    elif game.algorithm == "alpha_beta_MinMaxbest":
        score, move = game.alpha_beta_MinMaxbest(
            game.board, game.level, float("-inf"), float("inf"), game.k, False
        )

    game.board.push(move)
    uid(request.cookies.get("id"))
    return jsonify(
        {"message": "Valid move", "status": "ok", "move": move, "score": score}
    )


@app.route("/legal_move", methods=["POST", "GET"])
def legal_move():
    square = request.form["square"]
    if square:
        move = chess.parse_square(square)
        piece = game.board.piece_at(move)
        legal_moves = game.board.generate_legal_moves()

        moves = [
            move
            for move in legal_moves
            if game.board.piece_at(move.from_square) == piece
        ]
    else:
        moves_t = (
            str(game.board.legal_moves)[37:-1]
            .replace(", ", "', '")
            .replace("(", "('")
            .replace(")", "')")
        )
        moves_t = eval(moves_t)
        moves = []
        for i in moves_t:
            moves.append(i)
    return moves


@app.route("/best")
def best():
    if game.algorithm == "alpha_betaMinMaxL":
        _, move = game.alpha_betaMinMaxL(
            game.board, game.level, float("-inf"), float("inf"), True
        )
    elif game.algorithm == "alpha_beta_MinMaxbest":
        _, move = game.alpha_beta_MinMaxbest(
            game.board, game.level, float("-inf"), float("inf"), game.k, True
        )
    return str(move)


def uid(id=None):
    users = {}

    if not os.path.exists("users.json"):
        return jsonify({"message": "something went wrong", "status": "bad"})
    with open("users.json") as users_file:
        users = json.load(users_file)

    if id is not None:
        users[id] = str(game.board.board_fen())
    else:
        id = request.cookies.get("id")
        if id in users:
            game.board.set_board_fen(users[id])
    with open("users.json", "w") as url_file:
        json.dump(users, url_file)

    return jsonify({"message": "done", "status": "ok"})


@app.route("/reset")
def reset():
    game.board.reset()
    uid(request.cookies.get("id"))
    return jsonify({"message": "done", "status": "ok"})


@app.route("/undo")
def undo():
    try:
        game.board.pop()
        game.board.pop()
        uid(request.cookies.get("id"))
        return jsonify({"message": "undone succefully", "status": "ok"})
    except IndexError:
        return jsonify({"message": "No moves to undo", "status": "bad"})


@app.route("/settings", methods=["POST"])
def settings():
    game.k = int(request.form["k"])
    game.level = int(request.form["level"])
    game.algorithm = request.form["algorithm"]
    return jsonify({"message": "settings has been applied succefully", "status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)
