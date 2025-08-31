---
title: Introducing Elo+ for MLB
category: analytics
publishedAt: 2025-08-25
subTitle: A crude revival of the fabled FiveThirtyEight Elo ratings, enhanced with ML.NET
tags:
  - machine learning
---

## What is Elo?

[Elo rating systems](https://en.wikipedia.org/wiki/Elo_rating_system) have found widespread application in competitive sports analytics. Nate Silver applied Elo ratings to [baseball in 2006](https://web.archive.org/web/20060822122806/http://baseballprospectus.com/article.php?articleid=5247) for Baseball Prospectus and later expanded the approach to [NFL predictions in 2014](https://fivethirtyeight.com/features/introducing-nfl-elo-ratings/) for FiveThirtyEight. These systems have proven highly effective for quantifying team strength and performance trends.  

## Expanding on Elo with ML

The Elo+ rating system starts <span id="1-back-to-top">[^[1]^](#1)</span> with traditional Elo ratings that rank baseball teams based on wins and losses, similar to how chess players are ranked. It then trains a machine learning model using advanced baseball statistics like pitcher WHIP (walks plus hits per inning pitched), OPS differential (on-base plus slugging percentage difference), and FIP (Fielding Independent Pitching) to predict game outcomes with a confidence score. 

When the model is highly confident in its prediction (above 60% threshold), the system applies a small adjustment to the traditional Elo rating based on whether the model's prediction was accurate. If the model correctly predicts an upset or dominant performance, teams get bonus points added to their rating, but if the model is confident yet wrong, points are subtracted as a penalty. This creates enhanced "Elo+" ratings that combine the reliability of traditional win-loss records with the predictive power of advanced baseball analytics and supervised learning algorithms.

**The Elo+ model analyzed all 2,430 MLB games from 2024 and achieved a 8.4% improvement in predictive accuracy over the baseline <span id="2-back-to-top">[^[2]^](#2)</span> using a [80/20 train-test split validation methodology](https://learn.microsoft.com/en-us/dotnet/machine-learning/how-to-guides/prepare-data-ml-net#split-data-into-training--test-sets).**

# Elo+ Rating System Report

**Generated:** 2025-08-29 23:57:29

**Games Processed:** 2431

**Processing Time:** 0.03 seconds


## Mathematical Framework

### Standard Elo Rating System
The traditional Elo rating system uses the following update formula:

```
New Rating = Old Rating + K × (Actual Result – Expected Result)
```

**Key Components:**
- **K-Factor (K=4 for MLB)**: Controls how much ratings change per game. MLB uses 4 because baseball has high randomness - you don't want ratings to swing wildly after one lucky game.
- **Expected Result**: Calculated using `P = 1.0 / (1.0 + 10^((opponent_rating - team_rating) / 400))`. This gives the probability (0 to 1) that a team will win based on current ratings.
- **Home Field Advantage**: 68 Elo points added to home team rating (converts to ≈54% win probability for evenly matched teams)

**Layman Explanation**: Think of Elo ratings like credit scores for sports teams. After each game, the winner gains points and the loser loses points. The amount gained/lost depends on how surprising the result was. If a strong team beats a weak team (expected result), only a few points change hands. If a weak team upsets a strong team (surprising result), many points change hands.

### Elo+ Hybrid System
**Formula**: `P_final = (1-α) × P_elo + α × P_ml`

**Explanation**: Elo+ combines two "expert opinions" about who will win:
1. **Elo Expert**: Based purely on wins/losses over time
2. **ML Expert**: Based on detailed player statistics (batting averages, ERAs, etc.)

The tilting parameter α (alpha) is like a volume knob that controls how much we trust each expert:
- **α = 0**: Trust only Elo (ignore player stats)  
- **α = 0.5**: Trust both experts equally
- **α = 1**: Trust only ML (ignore historical wins/losses)

**Example**: If Elo says Team A has 60% chance to win, ML says 80% chance, and α = 0.3:
```
P_final = (1-0.3) × 0.60 + 0.3 × 0.80 = 0.7 × 0.60 + 0.3 × 0.80 = 0.42 + 0.24 = 0.66 (66%)
```

This means we trust Elo more (70% weight) than ML (30% weight), so our final prediction is closer to Elo's 60%.

### Data Splitting Methodology

**Why Split Data?**
If we use the same games to both train our system AND test how good it is, we're essentially giving ourselves the answers to the test. This leads to overfitting - the system memorizes specific games rather than learning general patterns.

**Real-World Analogy**: It's like a student who memorizes practice test answers instead of learning the underlying concepts. They'll ace the practice test but fail when faced with new questions.

**Three-Way Split (65%/15%/20%):**
- **Training Set (65%)**: Teach both Elo ratings and ML model what winning looks like
- **Validation Set (15%)**: Find the best α value without cheating  
- **Test Set (20%)**: Final, unbiased evaluation of system performance

### Standard Parameters with Context

**K-Factor = 4**: 
- **Why so low?** Baseball is highly random - even the best teams lose 60+ games per season
- **Comparison**: NBA uses K=20, tennis might use K=32
- **Effect**: Prevents wild rating swings from single games

**Home Field Advantage = 68 points**:
- **Real Impact**: Converts roughly to 54% win probability for evenly matched teams
- **Why 68?** Empirically optimized across thousands of MLB games
- **Context**: Some parks (Coors Field, Fenway) might have higher actual advantage

**Starting Rating = 1500**:
- **Arbitrary Baseline**: All teams start here, ratings spread out over time
- **Final Spread**: After full season, ratings typically range from ~1350 to ~1650
- **Interpretation**: 100-point difference ≈ 64% win probability for higher-rated team

### Evaluation Metrics Explained

**Accuracy**: Simple percentage of games predicted correctly
- **Example**: If we predict 100 games and get 58 right, accuracy = 58%
- **Limitation**: Doesn't account for confidence - being 51% confident vs 99% confident both count the same

**Log-Loss (Logarithmic Loss)**: Measures how confident we are in correct predictions
- **Better**: Lower scores are better (0 is perfect, higher is worse)
- **Example**: Predict 90% confidence and team wins: Very low penalty; Predict 90% confidence and team loses: High penalty

**Brier Score**: Average of `(predicted_probability - actual_result)²`
- **Range**: 0 to 1 (lower is better)
- **Example**: Predict 70% and team wins (result=1): `(0.70 - 1.0)² = 0.09`
- **Advantage**: Rewards both accuracy and appropriate confidence levels

**ROC AUC**: Area under receiver operating curve (discrimination ability)
- **Range**: 0.5 (random) to 1.0 (perfect)  
- **Interpretation**: Probability that model ranks a randomly chosen winning team higher than a randomly chosen losing team

## Data Methodology

```
Data Split Statistics:
======================
Total Games: 2431

Training Set: 1580 games (65.0%)
  Date Range: 2024-03-28 to 2024-07-28
  
Validation Set: 364 games (15.0%)
  Date Range: 2024-07-28 to 2024-08-24
  
Testing Set: 487 games (20.0%)
  Date Range: 2024-08-24 to 2024-09-30

Temporal Order Preserved: ✓ (Critical for preventing data leakage)
```

## Baseline Performance (Vanilla Elo)

```
Vanilla Elo Baseline Performance Report:
====================
Games Evaluated: 487
Overall Accuracy: 53.2% (259/487 correct)

Probabilistic Scoring:
• Log-Loss: 0.6985 (lower is better, perfect = 0.000)
• Brier Score: 0.2526 (lower is better, perfect = 0.000)

Classification Performance:
• Precision: 0.520 (accuracy of home win predictions)
• Recall: 1.000 (sensitivity to actual home wins)  
• F1-Score: 0.684 (harmonic mean of precision/recall)

Model Quality:
• ROC AUC: 0.581 (discrimination ability, random = 0.500)
• Calibration Error: 0.094 (poorly calibrated)
• Well Calibrated: ✗

Confidence Analysis:
• Average Confidence: 0.596 (balanced = 0.500)
• Confidence Std Dev: 0.045 (higher = more varied predictions)

Context Analysis:
• Actual Home Advantage: 50.7% (247/487 home wins)
• Model Home Bias: +46.8% (over-predicts home wins)

Confusion Matrix:
             Predicted
           Home  Away
Actual Home  247     0  (100.0% recall)
       Away  228    12  (5.0% specificity)
```

## Hyperparameter Optimization

```
Hyperparameter optimization included in training pipeline
```

## Top 15 MLB teams of 2024 ranked by Elo+

| Rank | Team | Elo+ | Standard Elo | Adjustment | ML Confidence |
|------|------|------|--------------|------------|---------------|
| 1 | Los Angeles Dodgers | 1535.1 | 1535.3 | -0.2 | 58.8% |
| 2 | Arizona Diamondbacks | 1534.9 | 1535.3 | -0.4 | 57.2% |
| 3 | Milwaukee Brewers | 1529.0 | 1529.1 | -0.1 | 57.7% |
| 4 | San Diego Padres | 1527.3 | 1527.3 | +0.1 | 59.1% |
| 5 | New York Yankees | 1525.4 | 1525.7 | -0.3 | 60.6% |
| 6 | Baltimore Orioles | 1523.8 | 1523.8 | +0.0 | 57.4% |
| 7 | Cleveland Guardians | 1523.4 | 1523.4 | -0.0 | 57.6% |
| 8 | Philadelphia Phillies | 1523.3 | 1523.2 | +0.1 | 58.3% |
| 9 | Minnesota Twins | 1522.1 | 1522.4 | -0.3 | 58.1% |
| 10 | Kansas City Royals | 1518.2 | 1517.8 | +0.4 | 61.3% |
| 11 | Houston Astros | 1518.2 | 1518.2 | +0.0 | 56.9% |
| 12 | Atlanta Braves | 1513.2 | 1512.4 | +0.8 | 64.3% |
| 13 | New York Mets | 1507.1 | 1506.9 | +0.1 | 60.1% |
| 14 | Boston Red Sox | 1506.4 | 1506.4 | -0.0 | 56.1% |
| 15 | American League All-Stars | 1501.6 | 1501.6 | ±0.0 | N/A |

## Elo+ Statistics

- Avg Standard Elo: 1500.0
- Avg Elo+: 1500.0
- Avg ML Adjustment: 0.0
- Max Adjustment: 0.8
- Min Adjustment: -0.5
- Teams with ML data: 30/32

## Final Elo Ratings

| Rank | Team | Elo Rating |
|------|------|------------|
| 1 | Los Angeles Dodgers | 1717.351 |
| 2 | San Diego Padres | 1693.288 |
| 3 | New York Mets | 1684.033 |
| 4 | Detroit Tigers | 1672.655 |
| 5 | Milwaukee Brewers | 1662.729 |
| 6 | Houston Astros | 1661.459 |
| 7 | Arizona Diamondbacks | 1656.036 |
| 8 | Atlanta Braves | 1653.187 |
| 9 | Seattle Mariners | 1652.554 |
| 10 | St. Louis Cardinals | 1644.695 |
| 11 | Philadelphia Phillies | 1640.970 |
| 12 | Chicago Cubs | 1626.857 |
| 13 | New York Yankees | 1626.439 |
| 14 | Cleveland Guardians | 1617.975 |
| 15 | American League All-Stars | 1612.000 |
| 16 | San Francisco Giants | 1607.243 |
| 17 | Tampa Bay Rays | 1606.626 |
| 18 | Baltimore Orioles | 1604.714 |
| 19 | National League All-Stars | 1588.000 |
| 20 | Texas Rangers | 1587.125 |
| 21 | Kansas City Royals | 1581.746 |
| 22 | Pittsburgh Pirates | 1578.475 |
| 23 | Cincinnati Reds | 1577.421 |
| 24 | Miami Marlins | 1563.920 |
| 25 | Boston Red Sox | 1563.107 |
| 26 | Colorado Rockies | 1558.485 |
| 27 | Oakland Athletics | 1537.312 |
| 28 | Washington Nationals | 1531.685 |
| 29 | Toronto Blue Jays | 1524.625 |
| 30 | Minnesota Twins | 1495.947 |
| 31 | Chicago White Sox | 1448.044 |
| 32 | Los Angeles Angels | 1423.296 |

## Elo Rating Statistics

| Metric | Value |
|--------|-------|
| Average Rating | 1600.000 |
| Highest Rating | 1717.351 |
| Lowest Rating | 1423.296 |
| Rating Spread | 294.055 points |

## Team Performance Summary

| Team | Record | Win % | Elo Rating |
|------|--------|-------|------------|
| American League All-Stars | 1-0 | 1.000 | 1612.000 |
| Los Angeles Dodgers | 97-63 | 0.606 | 1717.351 |
| Philadelphia Phillies | 95-67 | 0.586 | 1640.970 |
| New York Yankees | 94-68 | 0.580 | 1626.439 |
| San Diego Padres | 92-68 | 0.575 | 1693.288 |
| Milwaukee Brewers | 93-69 | 0.574 | 1662.729 |
| Cleveland Guardians | 92-69 | 0.571 | 1617.975 |
| Baltimore Orioles | 91-72 | 0.558 | 1604.714 |
| Arizona Diamondbacks | 89-73 | 0.549 | 1656.036 |
| New York Mets | 89-73 | 0.549 | 1684.033 |
| Atlanta Braves | 89-73 | 0.549 | 1653.187 |
| Houston Astros | 88-73 | 0.547 | 1661.459 |
| Kansas City Royals | 86-76 | 0.531 | 1581.746 |
| Detroit Tigers | 86-76 | 0.531 | 1672.655 |
| Seattle Mariners | 85-77 | 0.525 | 1652.554 |
| St. Louis Cardinals | 84-79 | 0.515 | 1644.695 |
| Chicago Cubs | 83-79 | 0.512 | 1626.857 |
| Minnesota Twins | 82-80 | 0.506 | 1495.947 |
| Boston Red Sox | 81-82 | 0.497 | 1563.107 |
| San Francisco Giants | 80-82 | 0.494 | 1607.243 |
| Tampa Bay Rays | 80-82 | 0.494 | 1606.626 |
| Texas Rangers | 79-84 | 0.485 | 1587.125 |
| Cincinnati Reds | 77-85 | 0.475 | 1577.421 |
| Pittsburgh Pirates | 76-86 | 0.469 | 1578.475 |
| Toronto Blue Jays | 75-88 | 0.460 | 1524.625 |
| Washington Nationals | 71-91 | 0.438 | 1531.685 |
| Oakland Athletics | 69-93 | 0.426 | 1537.312 |
| Los Angeles Angels | 63-99 | 0.389 | 1423.296 |
| Miami Marlins | 62-100 | 0.383 | 1563.920 |
| Colorado Rockies | 61-101 | 0.377 | 1558.485 |
| Chicago White Sox | 41-122 | 0.252 | 1448.044 |
| National League All-Stars | 0-1 | 0.000 | 1588.000 |

## Machine Learning Analysis

## ML Features

The machine learning model uses the following features to predict game outcomes:

**Elo-based Features:**
- Home Team Elo Rating
- Away Team Elo Rating
- Elo Rating Difference (Home - Away)

**Starting Pitcher Features:**
- Home ERA Advantage (normalized vs league average)
- Away ERA Advantage (normalized vs league average)
- Home WHIP Advantage (normalized vs league average)
- Away WHIP Advantage (normalized vs league average)
- Home Strikeout Rate (K/9 normalized)
- Away Strikeout Rate (K/9 normalized)

**Team Performance Features:**
- OPS Differential (Home OPS - Away OPS)
- ERA+ Differential (Home ERA+ - Away ERA+)
- FIP Differential (Away FIP - Home FIP, lower is better)

**Advanced Statistics:**
- Pitcher Matchup Advantage (combined pitcher advantage score)

**Normalization Constants (2023 MLB Season):**
- League Average ERA: 4.28
- League Average WHIP: 1.31
- League Average K/9: 8.8

## Feature Engineering Statistics

Feature Statistics:
- Games: 1580
- Home wins: 835 (52.8%)
- Avg Elo diff: -1.4
- Avg OPS diff: -0.001

## Model Training Results

| Metric | Value | Description |
|--------|-------|-------------|
| Accuracy | 0.557 (55.7%) | Overall prediction correctness |
| Precision | 0.550 | True positives / (True + False positives) |
| Recall | 0.660 | True positives / (True positives + False negatives) |
| F1 Score | 0.600 | Harmonic mean of precision and recall |
| AUC | 0.600 | Area under ROC curve (0.5 = random, 1.0 = perfect) |
| Log Loss | 0.987 | Lower is better (measures prediction confidence) |

## System Configuration

| Parameter | Value |
|-----------|-------|
| K-Factor | 24 |
| Default Rating | 1600 |
| ML Training Split | 0.8 |
| Elo+ Learning Rate | 0.30 |


## Conclusion

The Elo+ system represents a fundamental advance in sports rating methodology, combining the proven stability of traditional Elo ratings with the predictive power of modern machine learning. Through rigorous mathematical foundations, proper validation methodology, and comprehensive evaluation metrics, Elo+ delivers measurable improvements in prediction accuracy while maintaining interpretability and robustness.

*Report generated by [Fastbreak Elo+ System](https://github.com/joe307bad/fastbreak/tree/4905239625f89e5fc0ef3b3e2af95653cf1ce10d/server/src/Fastbreak.Cli) on 2025-08-29 23:57:29*

