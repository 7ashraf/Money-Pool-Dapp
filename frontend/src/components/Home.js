import React, {useEffect, useState} from "react";
import { ethers } from "ethers";

const {ethereum} = window;

const Home =()=>{
    const [currentAccount, setCurrentAccount] = useState('')


    const connectWallet = async() => {
        try{

            if(!ethereum) return alert('no metamask')
            const accounts = await ethereum.request({method: 'eth_requestAccounts'})
            setCurrentAccount(accounts[0])
            console.log(currentAccount)
            console.log('connect wallet method reached')
        }catch(error){
            console.log(error)
            throw new Error('no etherium object ')

        }
    }

    return(
        <div>
            <h1>Welcome to Money Pool d-app</h1>
            {currentAccount && <h2>address: {currentAccount}</h2>}
            {!currentAccount && <button type="button" class="btn btn-primary" onClick={connectWallet}>Connect wallet</button>}
        </div>
    )
}

export default Home;