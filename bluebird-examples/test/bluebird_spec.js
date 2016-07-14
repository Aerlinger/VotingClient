import { Promise } from 'bluebird';
import { expect } from 'chai';

describe("Bluebird promises", () => {
  let timedPrint;

  beforeEach(() => {
    timedPrint = function(message = "Finish!", waitInMilliseconds = 500) {

      return new Promise((resolve, reject) => {
        setTimeout(
          function() {
            resolve(message);
          },
          waitInMilliseconds
        );
      });
    };
  });

  it("can be chained", (done) => {
    let asyncAction = new Promise((resolve, reject) => {
      setTimeout(function() {
        console.log("resolve('bar', 'foo')");
        resolve('bar', 'foo');
      }, 10);
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
      setTimeout(resolve, 10);
    });

    p.then((message) => {
      console.log("Tock!", message);
      done();
    })
  });

  it("can run multiple promises concurrently", (done) => {
    let i = 0

    timedPrint("Third!", 300).then((msg) => {
      i++;

      expect(i).to.equal(3)
      // console.log(msg, "complete!");

      done()
    });

    timedPrint("Second!", 200).then((msg) => {
      i++;

      expect(i).to.equal(2)
      // console.log(msg, "complete!");
    });

    timedPrint("First!", 100).then((msg) => {
      i++;

      expect(i).to.equal(1)
      // console.log(msg, "complete!");
    });
  });

  it("can race async actions", (done) => {
    Promise
      .race(
        [
          timedPrint("Third!", 300),
          timedPrint("Second!", 200),
          timedPrint("First!", 100)
        ])
      .then(function(result) {
        // console.log("First to finish: ", result)

        expect(result).to.eq('First!')
        done()
      });
  });

  it("can wait for all async actions", (done) => {
    Promise
      .all(
        [
          timedPrint("Third!", 300),
          timedPrint("Second!", 200),
          timedPrint("First!", 100)
        ])
      .then(function(results) {
        // console.log("All complete: ", results)
        expect(results).to.eql(['Third!', 'Second!', 'First!']);
        done()
      });
  });
});
