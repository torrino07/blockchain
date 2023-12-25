// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract SimpleCounter {
    uint256 private _count;

    constructor(uint256 startValue) {
        _count = startValue;
    }

    function getCount() public view returns (uint256) {
        return _count;
    }

    function increment() public {
        _count += 1;
    }

    function decrement() public {
        require(_count > 0, "Counter cannot be negative");
        _count -= 1;
    }
}
