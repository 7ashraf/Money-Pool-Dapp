import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import { contractABI, constractAdress, moneyPoolABI } from "../utils/cons";
import { useParams } from "react-router-dom";


const {ethereum} = window;

const  MoneyPool = () =>{
    const address = useParams()['address']
    
    const [moneyPoolInfo, setMoneyPoolInfo] = useState({})

    const getInfo = async() =>{
        const contract = await getContract()
        const monthlyAmount = await contract.monthlyAmount()
        const poolAmount = await contract.poolAmount()
        const startDate = await contract.startDate()
        const endDate = await contract.endDate()
        //const receivalData = await contract.receivalData()
        const nextUserToReceive = await contract.getToReceive()
        const paidState = await contract.getUserPayState()

        setMoneyPoolInfo({
            monthlyAmount:monthlyAmount,
            poolAmount:poolAmount,
            startDate:0,
            endDate:0,
            receivalData:0,
            nextUserToReceive:0,
            paidState:false,
        })



    }


    const getContract = async() =>{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const moneyPoolContract = new ethers.Contract(address, moneyPoolABI, signer)
        console.log(moneyPoolContract)
        return moneyPoolContract;
    }


    console.log(moneyPoolInfo)
    console.log(address)

    useEffect(() => {
      
    getContract()
    getInfo()
    
    }, [moneyPoolInfo])
        
    
    return (
        <div>
            <h1>Money Pool: {address} </h1>
        </div>
    )

}
export default MoneyPool;