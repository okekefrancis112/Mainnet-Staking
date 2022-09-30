// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
interface IStaking {
    function lastTimeRewardApplicable() external view returns (uint);
    function stake(uint _amount) external;
    function withdraw(uint _amount) external;
    function earned(address _account) external view returns (uint);
    function setRewardsDuration(uint _duration) external;
    function notifyRewardAmount(uint _amount) external;
}