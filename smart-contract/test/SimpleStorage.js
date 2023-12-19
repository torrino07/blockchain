const { expect } = require("chai");

describe("SimpleStorage", function () {
  it("Should return the new value once it's changed", async function () {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();

    await simpleStorage.set(123);

    expect(await simpleStorage.get()).to.equal(123);
  });
});
