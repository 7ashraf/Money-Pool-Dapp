import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import { contractABI, constractAdress, moneyPoolABI } from "../utils/cons";
import { useParams } from "react-router-dom";


const {ethereum} = window;

const  MoneyPool = () =>{
    const address = useParams()['address']
    
    const [moneyPoolInfo, setMoneyPoolInfo] = useState({})

    const getInfo = async() =>{
        try{
        const contract = await getContract()
        const monthlyAmount = await contract.monthlyAmount()
        const poolAmount = await contract.poolAmount()
        const startDate = await contract.startDate()
        const endDate = await contract.endDate()
        const receivalData = await contract.getReceivalDate(address)
        const nextUserToReceive = await contract.getToReceive()
        const paidState = await contract.getUserPayState(address)
        const members = await contract.members(0);

        setMoneyPoolInfo({
            monthlyAmount:monthlyAmount ,
            poolAmount:poolAmount,
            startDate:startDate,
            endDate:endDate,
            receivalData:0,
            //CHECK ADDRESS TO RECEIVE LOGIC
            nextUserToReceive:nextUserToReceive,
            paidState:paidState,
            members:members
        })
        }catch(error){
            console.log(error);
        }
        



    }


    const getContract = async() =>{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const moneyPoolContract = new ethers.Contract(address, moneyPoolABI, signer)
        //console.log(moneyPoolContract)
        return moneyPoolContract;
    }


    console.log(moneyPoolInfo)
    //console.log(address)

    useEffect(() => {
      
    //getContract()
    getInfo()
    //console.log(moneyPoolInfo)
    
    }, [moneyPoolInfo])
        
    
    return (
        <div>
            <h1>Money Pool: {address} </h1>
        </div>
    )

}
export default MoneyPool;