# `evaluate_board`

This function calculates a score for the
current board position based on the material balance and
position of the pieces on the board. The score is positive if
white is doing better, and negative if black is doing better.
The function returns the final score.
To calculate a score, each piece that a player have on the
board has some value (9 for queen for example). We first
sum player pieces weights where ever they are on the board,
and then we add scores depending on how many pieces they
can attack.

# `alpha_betaMinMaxL`

This function has 5 parameters:

- The board
- the level `l`
- alpha
- beta
- flag maximizing_player that is `True` for the Max player and `False` for the Min player

We can play a chess game with 2 players and using the above function to choose each players moves. We loop until game is over. In each loop, we get the legal moves of the current player and choose the best move for the player using the `alpha_betaMinMaxL`: If the player is the White, we choose the move that maximizes the score, while if the player is the black one, we choose the move that minimizes the score.

# `alpha_beta_MinMaxbest`

In this version, we first evaluate the position after each legal move with the evaluate_board function and store the scores along with the moves in a list. Then we sort the list of moves based on their scores and select the top `k` moves to explore further. The parameter k specifies the chosen moves list length.
