/**
 * A tiny multilayer perceptron (MLP) written from scratch.
 * Hidden layers use tanh, the output uses a sigmoid, the loss is binary
 * cross-entropy, and learning uses mini-batch gradient descent with
 * hand-written backpropagation.
 */
(function (root) {
  const sigmoid = (z) => 1 / (1 + Math.exp(-z));
  const gaussian = (rng) => (rng() + rng() + rng() - 1.5) / 1.5;

  class Network {
    /** @param {number[]} hidden sizes of the hidden layers, e.g. [6, 6] */
    constructor(hidden, rng = Math.random) {
      this.rng = rng;
      this.sizes = [2, ...hidden, 1];
      this.steps = 0;
      this.W = [];
      this.b = [];
      for (let l = 0; l < this.sizes.length - 1; l++) {
        const fanIn = this.sizes[l];
        this.W.push(Array.from({ length: this.sizes[l + 1] }, () =>
          Array.from({ length: fanIn }, () => gaussian(rng) * Math.sqrt(2 / fanIn))));
        this.b.push(new Array(this.sizes[l + 1]).fill(0));
      }
    }

    /** Returns the activations of every layer (input first, output last). */
    forward(input) {
      const A = [input];
      const last = this.W.length - 1;
      for (let l = 0; l <= last; l++) {
        const prev = A[l];
        const z = this.W[l].map((w, j) => {
          let s = this.b[l][j];
          for (let i = 0; i < prev.length; i++) s += w[i] * prev[i];
          return s;
        });
        A.push(l === last ? z.map(sigmoid) : z.map(Math.tanh));
      }
      return A;
    }

    /** Probability (0..1) that the point (x, y) belongs to class 1. */
    predict(x, y) {
      const A = this.forward([x, y]);
      return A[A.length - 1][0];
    }

    /** One gradient-descent step on a batch of [x, y, label] samples. */
    trainBatch(batch, lr) {
      const n = this.W.length;
      const gW = this.W.map((m) => m.map((r) => r.map(() => 0)));
      const gb = this.b.map((v) => v.map(() => 0));
      for (const [x, y, target] of batch) {
        const A = this.forward([x, y]);
        let delta = [A[n][0] - target]; // sigmoid + cross-entropy gradient
        for (let l = n - 1; l >= 0; l--) {
          const next = new Array(this.sizes[l]).fill(0);
          for (let j = 0; j < delta.length; j++) {
            gb[l][j] += delta[j];
            for (let i = 0; i < this.sizes[l]; i++) {
              gW[l][j][i] += delta[j] * A[l][i];
              next[i] += delta[j] * this.W[l][j][i];
            }
          }
          if (l > 0) for (let i = 0; i < next.length; i++) next[i] *= 1 - A[l][i] * A[l][i]; // tanh'
          delta = next;
        }
      }
      const k = lr / batch.length;
      for (let l = 0; l < n; l++) {
        for (let j = 0; j < this.W[l].length; j++) {
          this.b[l][j] -= k * gb[l][j];
          for (let i = 0; i < this.W[l][j].length; i++) this.W[l][j][i] -= k * gW[l][j][i];
        }
      }
      this.steps++;
    }

    /** Average loss and accuracy over a dataset. */
    evaluate(data) {
      let loss = 0, correct = 0;
      for (const [x, y, t] of data) {
        const p = Math.min(1 - 1e-6, Math.max(1e-6, this.predict(x, y)));
        loss -= t ? Math.log(p) : Math.log(1 - p);
        if ((p > 0.5) === Boolean(t)) correct++;
      }
      return { loss: loss / data.length, accuracy: correct / data.length };
    }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { Network };
  else root.NP = Object.assign(root.NP || {}, { Network });
})(typeof window !== 'undefined' ? window : globalThis);
