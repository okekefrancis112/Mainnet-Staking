import { ethers } from "hardhat";

async function main() {

    const amountOut = 300;
    const amountIn = 5000;
    const duration = 2592000;
    const BoredApes = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

    //  deploy token
    const Token = await ethers.getContractFactory("HodlToken");
  const token = await Token.deploy();

  const  tok = await token.deployed();

  console.log("Token Address successfully deployed >>>>>>>", tok.address);

  //  deploy staking
  const Stake = await ethers.getContractFactory("Staking");
  const stake = await Stake.deploy(tok.address, tok.address);

  const  stk = await stake.deployed();

  console.log("successfully deployed >>>>>>>", stk.address);

  const Staker = "0x23d5C0bAdf63ff6422B5B9310211d9BcE147e720";

  const BA = await ethers.getContractAt("IERC721", BoredApes);
//   const 

  const Tok = await ethers.getContractAt("IERC20", tok.address);
  await Tok.transfer(Staker, amountOut);

    //  Staker bal
    const StakerBal = await Tok.balanceOf(Staker);
    console.log("Balance of Staker", StakerBal)

    // Transferring Tokens into the contract
    await Tok.transfer(stk.address, amountIn);

    // Staking  bal
    const StakingBal = await Tok.balanceOf(stk.address);
    console.log("Balance of Staking Contract", StakingBal);

    const Staking = await ethers.getContractAt("IStaking", stk.address);
    
    const time = await Staking.setRewardsDuration(duration);
    console.log("time >>>>>>>>>>>", time);

    await Tok.approve(Staker, 50);
    const Bet =  await Staking.stake(20);
    Bet.wait();
    console.log("Amount Staked", Bet);
    const Earnings = await Staking.earned(Staker);
    console.log("Amount Earned", Earnings);











}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
