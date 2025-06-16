
  export default questions = [
    {
      "question_id": 32,
      "question_number": 1,
      "title": "Evaluating Distribution Choice for Modeling Data",
      "body": {
        "Question": "Evaluate the suitability of using a Poisson distribution versus a Normal distribution to model the number of emails received per hour when the average rate is $\\lambda = 5$. Which distribution would you justify for this scenario and why?",
        "Description": "Consider a process where emails arrive independently and randomly over time with an average rate $\\lambda = 5$ emails per hour."
      },
      "is_objective": true,
      "difficulty_id": 5,
      "blooms_level": "Evaluate",
      "topic": "Probability",
      "sub_topic": "Distributions",
      "answer": {
        "text": "A",
        "explanation": "The Poisson distribution is appropriate for modeling the count of independent events occurring in a fixed interval with a known average rate $\\lambda$. Since the average number of emails per hour is $5$, which is relatively low, the Poisson distribution effectively models the discrete nature and variance of the data. The Normal distribution, while often used for large counts due to the Central Limit Theorem, may not capture the discrete and skewed nature of small count data as well as the Poisson distribution."
      },
      "choice_body": {
        "A": "Use the Poisson distribution because it models discrete event counts effectively for $\\lambda = 5$.",
        "B": "Use the Normal distribution because the average rate $\\lambda = 5$ is large enough to approximate the Poisson.",
        "C": "Use the Normal distribution since emails per hour can be continuous and symmetric.",
        "D": "Use neither distribution; a uniform distribution is better for modeling random email arrivals."
      }
    },
    {
      "question_id": 33,
      "question_number": 2,
      "title": "Definition of Probability Distribution",
      "body": {
        "Question": "What is a probability distribution in the context of probability theory?",
        "Description": "Recall the basic concept related to how probabilities are assigned to outcomes of a random variable."
      },
      "is_objective": true,
      "difficulty_id": 1,
      "blooms_level": "Remember",
      "topic": "Probability",
      "sub_topic": "Distributions",
      "answer": {
        "text": "A",
        "explanation": "A probability distribution defines the probabilities of all possible values of a random variable. Formally, it assigns a probability $P(X=x)$ to each outcome $x$ such that $0 \\leq P(X=x) \\leq 1$ and $\\sum_x P(X=x) = 1$."
      },
      "choice_body": {
        "A": "A function that assigns probabilities to each possible outcome of a random variable",
        "B": "A method for calculating the mean of a data set",
        "C": "A technique used to collect data from experiments",
        "D": "A graph that shows the relationship between two variables"
      }
    },
    {
      "question_id": 34,
      "question_number": 3,
      "title": "Applying Normal Distribution to Find Probabilities",
      "body": {
        "Question": "A machine produces ball bearings with diameters that are normally distributed with mean $\\mu = 5$ mm and standard deviation $\\sigma = 0.1$ mm. How would you use the normal distribution to find the probability that a randomly selected ball bearing has a diameter between $4.9$ mm and $5.1$ mm?",
        "Description": "Use the properties of the normal distribution to solve for $P(4.9 < X < 5.1)$ where $X$ is the diameter of the ball bearing."
      },
      "is_objective": true,
      "difficulty_id": 3,
      "blooms_level": "Apply",
      "topic": "Probability",
      "sub_topic": "Distributions",
      "answer": {
        "text": "A",
        "explanation": "First, convert the raw values to standard normal $z$-scores: $$z_1 = \\frac{4.9 - 5}{0.1} = -1, \\quad z_2 = \\frac{5.1 - 5}{0.1} = 1.$$ Then, find the probability using standard normal distribution tables or a calculator: $$P(4.9 < X < 5.1) = P(-1 < Z < 1) = \\Phi(1) - \\Phi(-1) = 0.8413 - 0.1587 = 0.6826.$$ Thus, the probability is approximately $0.683$."
      },
      "choice_body": {
        "A": "Calculate $P(4.9 < X < 5.1)$ by converting to $z$-scores: $z = \\frac{X - \\mu}{\\sigma}$ and using standard normal tables.",
        "B": "Use the binomial distribution with $n=5$ and $p=0.1$ to estimate the probability.",
        "C": "Apply the Poisson distribution with mean $\\lambda = 5$ to find the probability between $4.9$ and $5.1$.",
        "D": "Calculate the probability directly from the uniform distribution between $4.9$ and $5.1$."
      }
    },
    {
      "question_id": 35,
      "question_number": 4,
      "title": "Understanding Probability Distributions",
      "body": {
        "Question": "Which of the following best describes the main purpose of a probability distribution in probability theory?",
        "Description": "Consider that a probability distribution assigns probabilities to different possible outcomes of a random variable $X$."
      },
      "is_objective": true,
      "difficulty_id": 2,
      "blooms_level": "Understand",
      "topic": "Probability",
      "sub_topic": "Distributions",
      "answer": {
        "text": "A",
        "explanation": "A probability distribution explains how probabilities are assigned to the possible values of a random variable $X$. Specifically, it describes the likelihood of each outcome occurring, ensuring that the sum of all probabilities is 1."
      },
      "choice_body": {
        "A": "It explains how probabilities are assigned to the possible values of a random variable $X$.",
        "B": "It calculates the exact outcome of a random experiment.",
        "C": "It summarizes the total number of outcomes without considering probabilities.",
        "D": "It determines the cause of randomness in an experiment."
      }
    },
    {
      "question_id": 36,
      "question_number": 5,
      "title": "Analyzing Probability Distributions",
      "body": {
        "Question": "Analyze how the properties of the binomial distribution differ from those of the normal distribution. In your response, compare their assumptions, shapes, and applications, and explain how the binomial distribution relates to the normal distribution under certain conditions.",
        "Description": "Consider the parameters $n$ and $p$ for the binomial distribution, and the mean $\\mu$ and variance $\\sigma^2$ for the normal distribution. Discuss the connections between these distributions and when one can approximate the other."
      },
      "is_objective": false,
      "difficulty_id": 4,
      "blooms_level": "Analyze",
      "topic": "Probability",
      "sub_topic": "Distributions",
      "answer": {
        "text": "The binomial distribution is a discrete probability distribution with parameters $n$ (number of trials) and $p$ (probability of success), representing the number of successes in $n$ independent Bernoulli trials. It is defined only for integer values from 0 to $n$. The normal distribution is a continuous distribution characterized by mean $\\mu$ and variance $\\sigma^2$, with a symmetric bell-shaped curve defined for all real numbers.",
        "explanation": "The binomial distribution assumes fixed $n$ independent trials with identical probability $p$, resulting in a discrete probability mass function. Its shape can be symmetric or skewed depending on $p$ and $n$. The normal distribution assumes continuous outcomes and is symmetric about the mean $\\mu$. When $n$ is large and $p$ is not too close to 0 or 1, the binomial distribution can be approximated by a normal distribution with mean $\\mu = np$ and variance $\\sigma^2 = np(1-p)$. This is due to the Central Limit Theorem, which states that sums of independent random variables tend toward a normal distribution. Thus, the normal distribution serves as a useful approximation to the binomial distribution in many practical settings."
      },
      "choice_body": null
    }
  ]