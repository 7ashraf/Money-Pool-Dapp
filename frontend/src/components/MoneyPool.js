import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import { factoryABI, factoryAddress, moneyPoolABI } from "../utils/cons";
import { useParams, useLocation } from "react-router-dom";


const {ethereum} = window;

const  MoneyPool = () =>{
    const [loading, setLoading] = useState(true)

    const contractAdress = useParams()['address']
    const [currentAccount, setCurrentAccount] = useState(null)
    const location = useLocation()
    const [moneyPool, setMoneyPool] = useState(null)
    const factoryAdress = '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'
    
    const [moneyPoolInfo, setMoneyPoolInfo] = useState({})

    const getInfo = async() =>{
        var monthlyAmount;
        var poolAmount;
        var startDate
        var endDate
        var nextUserToReceive
        var members
        var isJoined
        var paidState

       try {
        monthlyAmount = await moneyPool.monthlyAmount()
        
       } catch (error) {
        console.log(error)
        
       }try {
        poolAmount = await moneyPool.poolAmount()
        
        
       } catch (error) {
        
       }try {
         startDate = await moneyPool.startDate()
        
        
       } catch (error) {
        
       }try {
         endDate = await moneyPool.endDate()
        
       } catch (error) {
        
       }try {
         nextUserToReceive = await moneyPool.getToReceive()
        
       } catch (error) {
        
       }try {
         paidState = await moneyPool.getUserPayState(currentAccount)
        
       } catch (error) {
        
       }try {
         isJoined = await moneyPool.isJoined(currentAccount)
        
        
       } catch (error) {
        
       }try {
         members = await moneyPool.getMembers();
        
       } catch (error) {
        
       }
        // const receivalData = await contract.getReceivalDate(currentAccount)
       setMoneyPoolInfo({
        monthlyAmount:monthlyAmount.toNumber(),
         poolAmount:poolAmount.toNumber(),
         startDate:startDate.toNumber(),
         endDate:endDate.toNumber(),
         nextUserToReceive:nextUserToReceive,
         members:members,
         isJoined:isJoined,
         paidState:paidState

       })
       setLoading(false)

    }


    const getContract = async() =>{
        const provider = await new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner()
        const moneyPoolContract = await new ethers.Contract(contractAdress, moneyPoolABI, signer)
        //console.log(moneyPoolContract)
        setMoneyPool(moneyPoolContract)
    }

    const joinMoneyPool = async()=>{
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner()
            const factory = new ethers.Contract(factoryAdress, moneyPoolABI, signer)
            //await factory.userMoneyPools[currentAccount].push(moneyPool)
            await moneyPool.join()
            
        } catch (error) {
            console.log(error)
        }
    }


    //  console.log(moneyPoolInfo)
    //console.log(address)

    useEffect(() => {
        

        setCurrentAccount(location.state)
        getContract()
        getInfo()
        //console.log(currentAccount)
    //console.log(moneyPoolInfo)
        //console.log(moneyPool)
    }, [moneyPoolInfo, currentAccount])
        
    
    return (
        
        <div>
            {loading? <h1>Loading...</h1>:
            <div>
                <h1>Money Pool: {moneyPoolInfo.address} </h1>
                {moneyPoolInfo.isJoined &&<div> <button type="button" className="btn btn-labeled btn-success">
                    <span className="btn-label"><i className="glyphicon glyphicon-ok"></i></span>Joined</button> </div>}
                
                {!moneyPoolInfo.isJoined &&<div> <button type="button" onClick={joinMoneyPool} className="btn btn-labeled btn-warning">
                <span className="btn-label"><i className="glyphicon glyphicon-ok"></i></span>Join</button> </div>}

                <h2>Pool Amount: {moneyPoolInfo.poolAmount}</h2>
                <h2>Monthly Amount: {moneyPoolInfo.monthlyAmount}</h2>
                <h2>Start Date: {new Date(moneyPoolInfo.startDate * 1000).toLocaleDateString("en-US")}</h2>
                <h2>End Date: {new Date(moneyPoolInfo.endDate * 1000).toLocaleDateString("en-US")}</h2>
                <h2>Members:</h2>
                <ul className="list-group list-group-flush">
                    {moneyPoolInfo.members?.map((member)=>
                        <li className="list-group-item" key={member}>{member}</li>
                    )}
                </ul> 
                
                <h2>nextUserToReceive: {moneyPoolInfo.nextUserToReceive}</h2>
                <h2>State
                    : in/active</h2>

            </div>}
        </div>
    )

}
export default MoneyPool;