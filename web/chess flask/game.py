import chess

board = chess.Board()


def evaluate_board(board):
    piece_values = {
        chess.PAWN: 1,
        chess.KNIGHT: 3,
        chess.BISHOP: 3,
        chess.ROOK: 5,
        chess.QUEEN: 9,
        chess.KING: 0,
    }
    score = 0
    for square, piece in board.piece_map().items():
        value = piece_values[piece.piece_type]
        if piece.color == chess.WHITE:
            score += value
        else:
            score -= value
        if piece.color == chess.WHITE:
            if piece.piece_type == chess.PAWN:
                score += 10 + (7 - chess.square_distance(square, chess.E2))
            elif piece.piece_type == chess.KNIGHT:
                score += 30 + len(board.attacks(square))
            elif piece.piece_type == chess.BISHOP:
                score += 30 + len(board.attacks(square))
            elif piece.piece_type == chess.ROOK:
                score += 50 + len(board.attacks(square))
            elif piece.piece_type == chess.QUEEN:
                score += 90 + len(board.attacks(square))
            elif piece.piece_type == chess.KING:
                score += 900 + len(board.attacks(square))
        else:
            if piece.piece_type == chess.PAWN:
                score -= 10 + (chess.square_distance(square, chess.E7))
            elif piece.piece_type == chess.KNIGHT:
                score -= 30 + len(board.attacks(square))
            elif piece.piece_type == chess.BISHOP:
                score -= 30 + len(board.attacks(square))
            elif piece.piece_type == chess.ROOK:
                score -= 50 + len(board.attacks(square))
            elif piece.piece_type == chess.QUEEN:
                score -= 90 + len(board.attacks(square))
            elif piece.piece_type == chess.KING:
                score -= 900 + len(board.attacks(square))
    return score


def alpha_betaMinMaxL(board, l, alpha, beta, maximizing_player):
    if board.is_checkmate() or board.is_stalemate() or l <= 0:
        return evaluate_board(board), None
    best_move = None
    if maximizing_player:
        best_score = float("-inf")
        for move in board.legal_moves:
            board.push(move)
            score, _ = alpha_betaMinMaxL(board, l - 1, alpha, beta, True)
            board.pop()
            alpha = max(alpha, score)
            if score > best_score:
                best_score = score
                best_move = move
            if alpha >= beta:
                break
        return best_score, best_move
    else:
        min_score = float("inf")
        for move in board.legal_moves:
            board.push(move)
            score, _ = alpha_betaMinMaxL(board, l - 1, alpha, beta, False)
            board.pop()
            beta = min(beta, score)
            if score < min_score:
                min_score = score
                best_move = move
            if alpha >= beta:
                break
        return min_score, best_move


def alpha_beta_MinMaxbest(board, l, alpha, beta, k, maximizing_player):
    if board.is_checkmate() or board.is_stalemate() or l <= 0:
        return evaluate_board(board), None
    best_move = None
    if maximizing_player:
        best_score = float("-inf")
        for move in board.legal_moves:
            board.push(move)
            score, _ = alpha_beta_MinMaxbest(board, l - 1, alpha, beta, k, True)
            board.pop()
            alpha = max(alpha, score)
            if score > best_score:
                best_score = score
                best_move = move
            if alpha >= beta:
                break
        return best_score, best_move
    else:
        min_score = float("inf")
        for move in board.legal_moves:
            board.push(move)
            score, _ = alpha_beta_MinMaxbest(board, l - 1, alpha, beta, k, False)
            board.pop()
            beta = min(beta, score)
            if score < min_score:
                min_score = score
                best_move = move
            if alpha >= beta:
                break
        return min_score, best_move


level = 2
k = 3
algorithm = "alpha_betaMinMaxL"
