⏺ Mathematical Equations for the Elo+ System

  Traditional Elo Rating Foundation

  • Expected Win Probability: P_expected = 1 / (1 + 
  10^((R_opponent - R_team) / 400))
  - Classical Elo formula for calculating win probability
  between two teams
  - 400-point scale ensures intuitive odds ratios (400
  points = 10:1 odds)

  • Home Field Advantage: P_home = 1 / (1 + 10^((R_away - 
  (R_home + HFA)) / 400))
  - Adjusts home team rating by HFA = 68.0 points for MLB
  - Empirically derived to give ~54% win probability for
  evenly matched teams

  • Rating Update Formula: R_new = R_old + K × (S_actual -
   P_expected)
  - K = 4.0 for MLB (FiveThirtyEight standard)
  - S_actual = 1.0 (win), 0.5 (tie), 0.0 (loss)
  - Zero-sum system: winner's gain equals loser's loss

  Machine Learning Feature Engineering

  • ERA Advantage: ERA_Advantage = (League_Avg_ERA - 
  Pitcher_ERA) / League_Avg_ERA
  - Normalizes pitcher ERA relative to league average
  (4.28 for MLB)
  - Positive values indicate better than average pitching

  • WHIP Advantage: WHIP_Advantage = (League_Avg_WHIP - 
  Pitcher_WHIP) / League_Avg_WHIP
  - Normalizes walks and hits per inning pitched (1.31
  league average)
  - Measures pitcher's ability to limit baserunners

  • Strikeout Rate: K_Rate = (Strikeouts × 9.0) / 
  InningsPitched / League_Avg_K_Per_9
  - Normalizes strikeouts per 9 innings (8.8 league
  average)
  - Higher values indicate more dominant pitching

  • OPS Differential: OPS_Diff = Home_OPS - Away_OPS
  - On-base plus slugging percentage difference
  - Measures offensive capability advantage

  • ERA+ Differential: ERA+_Diff = Home_ERA+ - Away_ERA+
  - Park-adjusted ERA comparison (100 = league average)
  - Accounts for ballpark effects on pitching statistics

  • FIP Differential: FIP_Diff = Away_FIP - Home_FIP
  - Fielding Independent Pitching difference (away - home
  because lower is better)
  - Measures "true" pitching performance independent of
  defense

  • Pitcher Matchup Advantage: PMA = (Home_ERA_Adv - 
  Away_ERA_Adv) + (Home_WHIP_Adv - Away_WHIP_Adv) +
  (Home_K_Rate - Away_K_Rate)
  - Composite interaction term combining all pitcher
  advantages
  - Captures overall pitching matchup dynamics

  Core Elo+ Tilting Models

  • Linear Combination Model: P_final = (1 - α) × P_elo + 
  α × P_ml
  - α ∈ [0, 1] is the tilting parameter
  - α = 0: Pure Elo, α = 1: Pure ML, α = 0.5: Equal
  weighting
  - Most straightforward ensemble approach

  • Weighted Average Model: P_final = (w_elo × P_elo + 
  w_ml × P_ml) / (w_elo + w_ml)
  - Independent weight control for each system
  - Allows asymmetric trust allocation based on historical
   performance

  • Confidence-Weighted Model: P_final = P_elo + α × C_ml 
  × (P_ml - P_elo)
  - C_ml is ML model confidence score [0, 1]
  - Only tilts when ML model is confident
  - Gracefully degrades to pure Elo when confidence is low

  Hyperparameter Optimization

  • Alpha Optimization: α* = argmin_α L(validation_set, α)
  - Grid search over α ∈ [0.0, 1.0] with step 0.1
  - Uses validation set to prevent overfitting

  • Log-Loss (Cross-Entropy): LogLoss = -1/N × Σ[y_i × 
  log(p_i) + (1-y_i) × log(1-p_i)]
  - Primary optimization metric for probabilistic
  predictions
  - Heavily penalizes confident wrong predictions

  • Brier Score: BrierScore = 1/N × Σ(p_i - y_i)²
  - Mean squared error of probability predictions
  - Measures both calibration and resolution

  Performance Evaluation Metrics

  • Accuracy: Accuracy = CorrectPredictions / 
  TotalPredictions
  - Basic classification performance metric
  - Percentage of correct binary win/loss predictions

  • Precision: Precision = TruePositives / (TruePositives 
  + FalsePositives)
  - Accuracy of positive (home win) predictions
  - Measures false positive rate control

  • Recall (Sensitivity): Recall = TruePositives / 
  (TruePositives + FalseNegatives)
  - True positive rate for home wins
  - Measures model's ability to identify actual home wins

  • F1-Score: F1 = 2 × (Precision × Recall) / (Precision +
   Recall)
  - Harmonic mean of precision and recall
  - Balanced measure of classification performance

  • ROC AUC: AUC = Σ[(FPR_{i+1} - FPR_i) × (TPR_i + 
  TPR_{i+1}) / 2]
  - Area under receiver operating characteristic curve
  - Measures discrimination ability across all probability
   thresholds

  • Calibration Error: CalError = Σ[w_i × |f_i - o_i|]
  - w_i = bin weight, f_i = mean predicted probability,
  o_i = observed frequency
  - Measures how well predicted probabilities match actual
   frequencies

  Statistical Validation Framework

  • Train/Validation/Test Split: 70% / 15% / 15%
  - Chronological splitting preserves temporal order
  - Prevents data leakage from future to past

  • Baseline Accuracy: Baseline = max(HomeWins, AwayWins) 
  / TotalGames
  - Always predict majority class performance
  - Minimum threshold for meaningful improvement

  • Cross-Validation: CV_Score = 1/k × Σ_{i=1}^k Score_i
  - k-fold validation with temporal ordering maintained
  - Robust estimate of hyperparameter performance

  Theoretical Foundations

  • Elo Performance Distribution: Performance ~ N(Rating, 
  σ²) where σ = 200
  - Assumes normal distribution of game performance around
   true skill
  - Performance difference standard deviation = 200√2

  • 400-Point Scale Interpretation:
  - 100 points ≈ 64% win probability
  - 200 points ≈ 76% win probability
  - 400 points ≈ 91% win probability (10:1 odds)

  • ML Enhancement Objective: Minimize E[(P_predicted - 
  P_actual)²]
  - Reduces prediction error through contextual
  information
  - Addresses Elo's limitation of using only historical
  win/loss results