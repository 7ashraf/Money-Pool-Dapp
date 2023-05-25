pragma solidity ^0.8.0;

contract MoneyPool {
    MoneyPoolFactory public factory;


    uint public monthlyAmount; // monthly amount to be contributed by each member
    uint public poolAmount;
    uint public startDate;
    uint public endDate;
    uint public duration;
    address[] public members; // array of members in the money pool
    mapping(address => uint) public usersPriority;
    mapping(address => bool) public usersReceiveState;
    mapping(address => bool) public usersPayState;
    uint public maxUsersNumber;
    address creator;

    //to be implemented
    bool moneyPoolState;
    uint reqruiredUsersNumber;


    uint public time = block.timestamp;

    
    // constructor to initialize the owner and monthly amount
    constructor(address _creator, uint _poolAmount, uint _monthlyAmount) {
        monthlyAmount = _monthlyAmount;
        poolAmount = _poolAmount;
        maxUsersNumber = _poolAmount / _monthlyAmount;
        duration = (_poolAmount / _monthlyAmount) *30*24*60*60;
        creator = _creator;

        join();
        usersPriority[_creator] = block.timestamp;
        startDate = block.timestamp;
        endDate = startDate + duration;
        factory = MoneyPoolFactory(msg.sender);


    }
    
    // function to deposit money into the money pool
    function deposit() public payable {
        require(isJoined(msg.sender), "User has not joined the pool");
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
        //CHECK IF TRANSACTION COMPLETED 
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
        if(members.length == 0){
            members.push(creator);
            usersPriority[creator] = block.timestamp;
            usersReceiveState[creator] = false;
            return;
        }
        //msg.sender is user
        require(members.length < maxUsersNumber, "Pool full");
        require(!isJoined(msg.sender), "User already exists");
        members.push(msg.sender);
        usersPriority[msg.sender] = block.timestamp;
        usersReceiveState[msg.sender] = false;
        factory.pushUserMoneyPool(msg.sender);
    }

    function isJoined(address _address) public view returns(bool){
        for(uint i =0; i<members.length; i++){
            if(members[i] == _address){
                return true;
            }
        }
        return false;
    }

    function getUserPayState(address _address) public view returns(bool){
        return usersPayState[_address];
    }

    function getReceivalDate(address _address) public view returns(uint){
        return 0;
    }

    function getMembers() public view returns(address[] memory coll){
        return members;
    }
  
}

contract MoneyPoolFactory {
    mapping(address => MoneyPool[]) public userMoneyPools;
    MoneyPool[] public moneyPools ;
    
    // function to create a new money pool for a user
    function createMoneyPool(address _creator, uint _poolTotal, uint _monthlyAmount) public {
        MoneyPool newMoneyPool = new MoneyPool(_creator,_poolTotal, _monthlyAmount);
        userMoneyPools[msg.sender].push(newMoneyPool);
        moneyPools.push(newMoneyPool);
    }
    
    // function to get the number of money pools for a user
    function getNumberOfMoneyPools() public view returns(uint) {
        return userMoneyPools[msg.sender].length;
    }

    function getUserMoneyPools(address _user) public view returns (MoneyPool[] memory coll){  
        return userMoneyPools[_user];
    }
    
    function getAllMoneyPools() public view returns (MoneyPool[] memory coll){
        return moneyPools;
    }
    function pushUserMoneyPool(address user) public{
        //in this case msg.sender is the moneypool it self
        userMoneyPools[user].push(MoneyPool(msg.sender));
    }
}