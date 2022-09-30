import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {

    const amountOut = ethers.utils.parseEther("300");
    const amountIn = ethers.utils.parseEther("5000");
    const duration = 2592000; 
    const BoredApes = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';

    //  deploy token
    const Token = await ethers.getContractFactory("HodlToken");
  const token = await Token.deploy();

  const  tok = await token.deployed();

  console.log("Token Address successfully deployed >>>>>>>", tok.address);

  //  deploy staking
  const Stake = await ethers.getContractFactory("Staking");
  const stake = await Stake.deploy(tok.address, tok.address, BoredApes);

  const  stk = await stake.deployed();

  console.log("successfully deployed >>>>>>>", stk.address);

//   const Staker = "0x23d5C0bAdf63ff6422B5B9310211d9BcE147e720";

//   const BA = await ethers.getContractAt("IERC721", BoredApes);
  const BAholder = "0x2c2ed4b3876c442fee80BeE76Ce0eE2CA2A512AF";
  await helpers.impersonateAccount(BAholder);
  const Signer = await ethers.getSigner(BAholder);

  

  const Tok = await ethers.getContractAt("IERC20", tok.address);
//   await Tok.transfer(BAholder, amountOut);

    //  Staker bal
    // const StakerBal = await Tok.balanceOf(BAholder);
    // console.log("Balance of Staker", StakerBal)

    // Transferring Tokens into the contract
    await Tok.transfer(stk.address, amountIn);
    // await Tok.transfer(BAholder, amountIn);
    await Tok.transfer(Signer.address, amountIn);

    // Staking  bal
    const StakingBal = await Tok.balanceOf(stk.address);
    // const BAholderBal = await Tok.balanceOf(BAholder);
    const SignerBal = await Tok.balanceOf(Signer.address);
    console.log("Balance of Staking Contract", StakingBal);
    console.log("Balance of Signer Contract", SignerBal);


    const Staking = await ethers.getContractAt("IStaking", stk.address);
    // console.log("Staking Contract >>>>>>>>>>>.", Staking );

    // Approve Staking contract
    // const Signer = await ethers.getImpersonatedSigner(BAholder);
    // console.log("Signer ===========================", Signer);
    // await Staking.connect(Signer).Approve(50);
    const Approve = await Tok.connect(Signer).approve(stk.address, amountOut);
    console.log("Approve ============================== ", Approve);
    
    const time = await Staking.setRewardsDuration(duration);
    time.wait();
    console.log("time >>>>>>>>>>>>>>>>>>>>>>", time);

    // await Tok.approve(Staker, 50);
    const Bet =  await Staking.connect(Signer).stake(amountOut);
    Bet.wait(6);
    console.log("Amount Staked ===============================", Bet);
    const Earnings = await Staking.earned(BAholder);
    console.log("Amount Earned", Earnings.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
