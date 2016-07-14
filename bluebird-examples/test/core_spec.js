import { Promise } from 'bluebird';
import { expect } from 'chai';

describe("Bluebird promises", () => {
  it("can be chained", (done) => {
    new Promise(function(function resolve, function reject) resolver) -> Promise
    let asyncAction = new Promise((resolve, reject) => {
      setTimeout(function() {
        console.log("resolve('bar', 'foo')");
        resolve('bar', 'foo');
      }, 1000);
    });

    asyncAction
      .then(function(arg1) {
        console.log(arg1);
        return "First thenable"
      })
      .then(function(arg1) {
        console.log(arg1);
        return ["baz", "qux"]
      })
      .spread((item1, item2) => {
        console.log(".spread((item1, item2) -> ", item1, item2);
        expect("asdf").to.eq("asdf");
        done()
      });
  });

  it("can pass a resolver as a function object", (done) => {
    let p = new Promise(function(resolve, reject) {
      setTimeout(resolve, 1000);
    });

    p.then((message) => {
      console.log("Tock!", message);
      done();
    })
  });
});
