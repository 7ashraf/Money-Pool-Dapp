import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import { factoryABI, factoryAddress } from "../utils/cons";
import { Link } from "react-router-dom";


const {ethereum} = window;

const Home =()=>{
    const [currentAccount, setCurrentAccount] = useState(null)
    const [userMoneyPools, setUserMoneyPools] = useState([])
    const [allMoneyPools, setAllMoneyPools] = useState([])

    const connectWallet = async() => {
        try{

            if(!ethereum) return alert('no metamask')
            const accounts = await ethereum.request({method: 'eth_requestAccounts'})
            setCurrentAccount(accounts[0])
            //console.log('current account: ' + currentAccount)
            //console.log('connect wallet method done')
        }catch(error){
            console.log(error)
            throw new Error('no etherium object ')

        }
    }
    
    const getContract = () => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const moneyPoolFactoryContract = new ethers.Contract(factoryAddress, factoryABI, signer)
        //console.log(moneyPoolFactotyContract)
        return moneyPoolFactoryContract;
    }
    const getUserMoneyPools = async() => {
        try {
            const moneyPoolFactory =  getContract()
            //console.log(moneyPoolFactory)
            const userMoneyPools = await moneyPoolFactory.getUserMoneyPools(currentAccount)
            //console.log(userMoneyPools)
            setUserMoneyPools(userMoneyPools)
        } catch (error) {
            console.log(error.message)
        }
    }

    const createMoneyPool = async ()=>{
        const moneyPoolFactory = getContract()
        const transactionHash = await moneyPoolFactory.createMoneyPool(currentAccount, 30, 10)
        console.log(`loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`money pool creation Success - ${transactionHash.hash}`)
    } 

    const getAllMoneyPools = async()=>{
        try {
            const contract = getContract()
            const pools = await contract.getAllMoneyPools()
            setAllMoneyPools(pools)
        } catch (error) {
            console.log(error)
        } 
        
    }

    useEffect(
        () => {
            connectWallet()
            getUserMoneyPools()
            getAllMoneyPools()
//          console.log(userMoneyPools)
        },
        [currentAccount, userMoneyPools]
      );
    
    
        
    return(
        <div>
            <h1>Welcome to Money Pool d-app</h1>
            {currentAccount && <h2>address: {currentAccount}</h2>}
            {!currentAccount &&<div> <button type="button" className="btn btn-primary" onClick={connectWallet}>Connect wallet</button>
            </div>}
           
            {currentAccount && 
                <div>
                    <h2>My Money pools</h2>
                    
                        <ul className="list-group list-group-flush">
                        {userMoneyPools.length ? userMoneyPools.map((moneyPool, i)=>
                            <li className="list-group-item" key={moneyPool}>
                                <Link to={`money-pool/${moneyPool}`} state={currentAccount}>{moneyPool}</Link>
                            </li>
                        ) :  <li className="list-group-item">No Money Pools</li>}
                         </ul>
                         <button type="button" className="btn btn-primary" onClick={createMoneyPool}>createMoneyPool</button>                    
                    

                </div>}
                
                <div>
                    <h2>All Money Pools</h2>
                    <ul className="list-group list-group-flush">
                        {allMoneyPools.length ? allMoneyPools.map((moneyPool, i)=>
                            <li className="list-group-item" key={moneyPool}>
                                <Link to={`money-pool/${moneyPool}`} state={currentAccount}>{moneyPool}</Link>
                            </li>
                        ) :  <li className="list-group-item">No Money Pools</li>}
                         </ul>
                </div>
        </div>
        
    )
}

export default Home;