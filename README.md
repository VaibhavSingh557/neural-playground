# Neural Playground

**Watch a neural network learn, live in your browser.** Pick a pattern, change the network, and see what it can and cannot learn. The network is written from scratch in plain JavaScript: no frameworks, no machine learning libraries, no API calls.

**[Live demo](https://vaibhavsingh557.github.io/neural-playground/)**



![Neural Playground screenshot](docs/screenshot.png)



## Why this project

Most people use machine learning through libraries that hide how it works. This project makes the core idea visible: a model starts out guessing, measures how wrong it is, and nudges its numbers to be less wrong, thousands of times.

## Features

- Four patterns: circles, XOR, moons and spiral
- Adjustable hidden layers (0 to 3), neurons (1 to 10) and learning rate
- Live decision boundary plus loss and accuracy readouts
- Backpropagation and gradient descent implemented by hand in `js/network.js`
- Unit tests that prove the network learns, and prove it fails where theory says it should
- Light and dark mode, keyboard accessible, works on mobile

## How it works

The model is a multilayer perceptron with two inputs (the x and y position of a point) and one output (the probability that the point is class B).

- **Hidden layers:** each neuron computes a weighted sum of its inputs and passes it through `tanh`.
- **Output:** a sigmoid squashes the final value into a probability.
- **Loss:** binary cross-entropy measures how far the predictions are from the true labels.
- **Learning:** for each mini-batch of 16 points, backpropagation computes how each weight affects the loss, and gradient descent moves every weight a small step (the learning rate) in the direction that lowers it.

With no hidden layers the model is just logistic regression, which can only draw a straight line. That is why it fails on circles and XOR, and why adding a hidden layer fixes it.

## Run it

Open `index.html` in a browser, or serve it locally:

```bash
npm start        # http://localhost:8000
npm test         # runs the unit tests (Node 18+, nothing to install)
```

## Project structure

```
index.html            page
css/style.css         theme and layout
js/network.js         the neural network (forward pass, backprop, training)
js/datasets.js        the four data patterns
js/app.js             controls and drawing
test/network.test.js  unit tests
.github/workflows/    CI tests and GitHub Pages deploy
```

## Roadmap

- [ ] Momentum and Adam optimizers
- [ ] More activation functions (ReLU, sigmoid)
- [ ] Per-neuron heatmaps
- [ ] An optional LLM explainer that describes what the network is doing

## Author

Built by [Vaibhav Singh](https://github.com/VaibhavSingh557).

## License

MIT
