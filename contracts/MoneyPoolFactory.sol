pragma solidity ^0.8.0;

contract MoneyPool {
    uint public monthlyAmount; // monthly amount to be contributed by each member
    uint public poolAmount;
    uint startDate;
    uint endDate;
    uint public duration;
    address[] public members; // array of members in the money pool
    mapping(address => uint) public usersPriority;
    mapping(address => bool) public usersReceiveState;
    mapping(address => bool) public usersPayState;
    uint public maxUsersNumber;


    uint public time = block.timestamp;

    
    // constructor to initialize the owner and monthly amount
    constructor(uint _poolAmount, uint _monthlyAmount) {
        monthlyAmount = _monthlyAmount;
        poolAmount = _poolAmount;
        maxUsersNumber = _poolAmount / _monthlyAmount;
        duration = _poolAmount / _monthlyAmount;
        usersPriority[msg.sender] = block.timestamp;
    }
    
    // function to deposit money into the money pool
    function deposit() public payable {
        bool exists = false;
        for (uint i = 0; i < members.length; i++) {
        if (members[i] == msg.sender) {
            exists = true;
        }
        }
        require(exists, "User has not joined the pool");
        require(!usersPayState[msg.sender], "User already paid");
        require(msg.value == monthlyAmount, "Invalid deposit amount");
        usersPayState[msg.sender] = true;
        if(getBalance() == poolAmount){
            withdraw();
        }
    }
    
    // function to get the current balance of the money pool
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    // function to get the number of members in the money pool
    function getNumberOfMembers() public view returns(uint) {
        return members.length;
    }
    
    // function to withdraw the total amount in the money pool by the owner
    function withdraw() public {
        address toReceive = getToReceive();
        payable(toReceive).transfer(getBalance());
        usersReceiveState[toReceive] = true;
        for(uint i =0; i<members.length; i++){
            usersPayState[members[i]] = false;
        }
    }

    function getToReceive() public view returns (address) {
        address max = members[0];
        for(uint i =0; i < members.length; i++){
            //if priority if user is higher than max, and user did not recieve money
            if(usersPriority[members[i]] > usersPriority[max] && !usersReceiveState[members[i]]){
                max = members[i];
            }
        }
        return max;
    }

    function join() public {
        require(members.length < maxUsersNumber, "Pool full");
        bool exists = false;
        for (uint i = 0; i < members.length; i++) {
        if (members[i] == msg.sender) {
            exists = true;
        }
        }
        require(!exists, "User already exists");
        members.push(msg.sender);
        usersPriority[msg.sender] = block.timestamp;
        usersReceiveState[msg.sender] = false;
    }
  
}

contract MoneyPoolFactory {
    mapping(address => MoneyPool[]) public userMoneyPools;
    MoneyPool[] public moneyPools ;
    mapping(address => MoneyPool) public moneyPoolsMapping;

    
    // function to create a new money pool for a user
    function createMoneyPool(uint _poolTotal, uint _monthlyAmount) public {
        MoneyPool newMoneyPool = new MoneyPool(_poolTotal, _monthlyAmount);
        userMoneyPools[msg.sender].push(newMoneyPool);
        moneyPools.push(newMoneyPool);
    }
    
    // function to get the number of money pools for a user
    function getNumberOfMoneyPools() public view returns(uint) {
        return userMoneyPools[msg.sender].length;
    }

    function getUserMoneyPools(address _user)
        public
        view
        returns (MoneyPool[] memory coll)
    {
        
        return userMoneyPools[_user];
    }
    
}