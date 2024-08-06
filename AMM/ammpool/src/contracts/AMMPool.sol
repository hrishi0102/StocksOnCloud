// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract StocksOnCloud {

    address internal immutable USDC = 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E;
    address internal immutable ETH = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
    address internal immutable BTC = 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43;
    AggregatorV3Interface internal dataFeedUSDC; 
    AggregatorV3Interface internal dataFeedETH;
    AggregatorV3Interface internal dataFeedBTC;
    uint256 public USDC_BALANCE = 175834;
    uint256 public ETH_BALANCE = 50;
    uint256 public BTC_BALANCE = 2;

    function getConstantProduct() public view returns (uint256) {
        uint256 newval = USDC_BALANCE * ETH_BALANCE;
        return newval;
    }

    function addLiquidityETH(uint256 _amt) external returns(bool){
        ETH_BALANCE += _amt;
        return true;
    }

    function addLiquidityUSDC(uint256 _amt) external returns(bool){
        USDC_BALANCE += _amt;
        return true;
    }

    constructor() {
        dataFeedUSDC = AggregatorV3Interface(
            USDC
        );
        dataFeedETH = AggregatorV3Interface(
            ETH
        );
        dataFeedBTC = AggregatorV3Interface(
            BTC
        );


    }

    function resetBal() public returns(bool){
        USDC_BALANCE = 175834;
        ETH_BALANCE = 50;
        return true;
    }


    function getDataFeedETH() public view returns (int, uint8) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeedETH.latestRoundData();
        uint8 val = dataFeedETH.decimals();
        return (answer, val);
    }

    function getDataFeedUSDC() public view returns(int, uint8){
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeedUSDC.latestRoundData();
        uint8 val = dataFeedUSDC.decimals();
        return (answer, val);
    }

    function getDataFeedBTC() public view returns (int, uint8) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeedBTC.latestRoundData();
        uint8 val = dataFeedBTC.decimals();
        return (answer, val);
    }

    function buyAsset(uint256 _quantity) external returns(uint256){
        // Buy ETH for USDC
        uint256 updatedETH = ETH_BALANCE - _quantity;
        uint256 updatedUSDC = getConstantProduct() / updatedETH;
        uint256 amountTobePaid = updatedUSDC - USDC_BALANCE;
        ETH_BALANCE = updatedETH;
        USDC_BALANCE = updatedUSDC;
        return amountTobePaid;
    }

    function getbuyAssetAmt(uint256 _quantity) external view returns(uint256){
        // Buy ETH for USDC
        uint256 updatedETH = ETH_BALANCE - _quantity;
        uint256 updatedUSDC = getConstantProduct() / updatedETH;
        uint256 amountTobePaid = updatedUSDC - USDC_BALANCE;
        return amountTobePaid;
    }

    function sellAsset(uint256 _quantity) external returns(uint256){
        // Sell ETH for USDC, give eth get usdc
        uint256 updatedETH = ETH_BALANCE + _quantity;
        uint256 updatedUSDC = getConstantProduct() / updatedETH;
        uint256 receivedUSDC = USDC_BALANCE - updatedUSDC;
        ETH_BALANCE = updatedETH;
        USDC_BALANCE = updatedUSDC;
        return receivedUSDC;
    }
    function getsellAssetAmt(uint256 _quantity) external view returns(uint256){
        // Sell ETH for USDC, give eth get usdc
        uint256 updatedETH = ETH_BALANCE + _quantity;
        uint256 updatedUSDC = getConstantProduct() / updatedETH;
        uint256 receivedUSDC = USDC_BALANCE - updatedUSDC;
        return receivedUSDC;
    }

}