export default questions = [
  {
    "question_id": 27,
    "question_number": 1,
    "title": "Definition of Probability Distribution",
    "body": {
      "Question": "What is a probability distribution in the context of probability theory?",
      "Description": "Recall the basic concept that describes how probabilities are assigned to different outcomes of a random experiment."
    },
    "is_objective": true,
    "difficulty_id": 1,
    "blooms_level": "Remember",
    "topic": "Probability",
    "sub_topic": "Distributions",
    "answer": {
      "text": "A",
      "explanation": "A probability distribution defines how probabilities are assigned to all possible outcomes of a random variable, ensuring the total probability sums to 1."
    },
    "correct": 1,
    "choice_body": [
       "A function that assigns probabilities to each possible outcome of a random experiment",
       "The average value of all possible outcomes",
       "The sum of all possible outcomes",
       "A measure of the spread of data around the mean"
    ]
  },
  {
    "question_id": 28,
    "question_number": 2,
    "title": "Evaluating the appropriateness of normal distribution for modeling data",
    "body": {
      "Question": "Evaluate the effectiveness of using a normal distribution to model the probability of outcomes when the data is heavily skewed to the right. Which statement best justifies your decision?",
      "Description": "Consider a dataset where the variable $X$ exhibits significant right skewness. Assess the suitability of applying a normal distribution to represent the probability distribution of $X$."
    },
    "is_objective": true,
    "difficulty_id": 5,
    "blooms_level": "Evaluate",
    "topic": "Probability",
    "sub_topic": "Distributions",
    "correct": 3,
    "answer": {
      "text": "D",
      "explanation": "A normal distribution is symmetric and assumes data is evenly distributed around the mean. When the data is heavily right-skewed, the normal distribution poorly models the probability since it underestimates the likelihood of extreme high values. Therefore, option D correctly appraises that the normal distribution is inappropriate for such skewed data."
    },
    "choice_body": [
       "The normal distribution is effective because it approximates any distribution with a large sample size due to the Central Limit Theorem.",
       "It is appropriate since the mean and variance are sufficient statistics for modeling right-skewed data with a normal distribution.",
       "Using a normal distribution is justified because skewness does not affect the probability estimates significantly.",
       "The normal distribution is ineffective because it assumes symmetry, which contradicts the heavy right skewness observed."
    ]
  },
  {
    "question_id": 29,
    "question_number": 3,
    "title": "Analyzing Probability Distributions",
    "body": {
      "Question": "Analyze the key differences between discrete and continuous probability distributions. How do these differences affect the way probabilities are calculated and interpreted for each type of distribution?",
      "Description": "In your response, compare characteristics such as the domain of the random variable, the representation of probabilities, and the use of probability mass functions versus probability density functions."
    },
    "is_objective": false,
    "difficulty_id": 4,
    "blooms_level": "Analyze",
    "topic": "Probability",
    "sub_topic": "Distributions",
    "answer": {
      "text": "Discrete probability distributions assign probabilities to countable outcomes, using a probability mass function (PMF) where $P(X = x_i)$ gives the probability of each specific outcome. Continuous probability distributions, however, deal with uncountably infinite outcomes over intervals, using a probability density function (PDF) $f(x)$, where probabilities are found by integrating over intervals: $P(a \\leq X \\leq b) = \\int_a^b f(x) \\, dx$.",
      "explanation": "The key difference lies in the nature of the random variable's domain: discrete variables take distinct values allowing direct probability assignment via PMFs, while continuous variables take values over intervals, requiring calculation of probabilities as areas under the PDF curve. This affects interpretation—discrete probabilities are exact for individual points, but continuous probabilities for single points are zero and only intervals have non-zero probability. Thus, probability calculation shifts from summation in discrete cases to integration in continuous cases."
    },
    "choice_body": null
  },
  {
    "question_id": 30,
    "question_number": 4,
    "title": "Understanding Probability Distributions",
    "body": {
      "Question": "Describe the main difference between a discrete probability distribution and a continuous probability distribution.",
      "Description": "Consider how probability values are assigned to outcomes in distributions where the sample space is either countable or uncountable."
    },
    "is_objective": true,
    "difficulty_id": 2,
    "blooms_level": "Understand",
    "topic": "Probability",
    "sub_topic": "Distributions",
    "correct": 0,
    "answer": {
      "text": "A",
      "explanation": "A discrete probability distribution assigns probabilities to countable outcomes, such as integers, where $P(X=x)$ is defined for specific values of $x$. A continuous probability distribution assigns probabilities over an uncountable range of values, where individual outcomes have zero probability and probabilities are found over intervals using a probability density function (PDF)."
    },
    "choice_body": [
       "Discrete distributions assign probabilities to countable outcomes, while continuous distributions assign probabilities over intervals of uncountable outcomes.",
       "Discrete distributions have probabilities greater than 1, while continuous distributions always have probabilities less than 1.",
       "Discrete distributions only describe events with two outcomes, whereas continuous distributions describe events with more than two outcomes.",
       "Discrete distributions use probability density functions, while continuous distributions use probability mass functions."
    ]
  },
  {
    "question_id": 31,
    "question_number": 5,
    "title": "Applying the Binomial Distribution to a Probability Problem",
    "body": {
      "Question": "A factory produces light bulbs with a 5% defect rate. If you randomly select 10 bulbs, how would you use the binomial distribution to find the probability that exactly 2 bulbs are defective? Identify the correct probability expression.",
      "Description": "Use the binomial distribution formula where $n$ is the number of trials, $k$ is the number of successes (defective bulbs), and $p$ is the probability of a defective bulb."
    },
    "is_objective": true,
    "difficulty_id": 3,
    "blooms_level": "Apply",
    "topic": "Probability",
    "sub_topic": "Distributions",
    "correct": 0,
    "answer": {
      "text": "A",
      "explanation": "The binomial distribution probability is given by $$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$. Here, $n=10$, $k=2$, and $p=0.05$. Substituting these values gives $$P(X=2) = \\binom{10}{2} (0.05)^2 (0.95)^8$$."
    },
    "choice_body": [
       "$\\binom{10}{2} (0.05)^2 (0.95)^8$",
       "$\\binom{10}{2} (0.95)^2 (0.05)^8$",
       "$\\binom{2}{10} (0.05)^{10} (0.95)^2$",
       "$\\binom{8}{2} (0.05)^8 (0.95)^2$"
    ]
  },
  {
    "question_id": 32,
    "question_number": 6,
    "title": "Applying the Binomial Distribution to a Probability Problem",
    "body": {
      "Question": "When $a\\ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are",
      "Description": "Use the binomial distribution formula where $n$ is the number of trials, $k$ is the number of successes (defective bulbs), and $p$ is the probability of a defective bulb."
    },
    "is_objective": true,
    "difficulty_id": 3,
    "blooms_level": "Apply",
    "topic": "Probability",
    "sub_topic": "Distributions",
    "correct": 1,
    "answer": {
      "text": "B",
      "explanation": "The binomial distribution probability is given by $$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$. Here, $n=10$, $k=2$, and $p=0.05$. Substituting these values gives $$P(X=2) = \\binom{10}{2} (0.05)^2 (0.95)^8$$."
    },
    "choice_body": [
      "$$x = {b \\pm \\sqrt{b^2-4ac} \\over 2a}$$",
      "$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$",
      "$$x = {-a \\pm \\sqrt{b^2-4ac} \\over 2b}$$",
      "$$x = {a \\pm \\sqrt{b^2-4ac} \\over 2b}$$"
    ]
  }
];