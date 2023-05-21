// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;


import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";



contract Sunified is 
AccessControl,
ERC20 {
    /**  
    ================================================
    |            Contract Events                   |
    ================================================
    **/

    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    /* @Dev: Event for when a new holder is added. Includes thier address and total shares. */
    event holderAdded(address account, uint256 shares);

    /*
    @Dev: Event for when shares are adjusted.
    */
    event SharesSold(address purchased, uint256 shares);

    /*
    @Dev: Event for when shares are adjusted.
    */
    event SharesAdjusted(address holder, uint256 shares);
    
    event Updatedholder(
        address indexed previousholderRewardAddress,
        address indexed newholderRewardAddress
    );

    event PaymentReleased(address to, uint256 amount);

    /**  
    ================================================
    |        Contract State Variables              |
    ================================================
    **/

    /* @Dev: Sum of all shares collectively held by addresses for division of currency. */
    uint256 private _totalShares;

    /* @Dev: Sum of all currency collectively released. */
    uint256 private _totalReleased;

    /* Dev: Seller Address Storage -- first position in array when deployed.*/
    address public seller;

    /*Dev: Price of share to but from contract*/
    uint256 public price;


    /* 
    @Dev: Mapping between an address and the number of shares it of currency it recieves. 
    @Notice: Payment = _shares/_totalShares * contract balance.
    */
    mapping(address => uint256) private _shares;

    mapping(address => uint256) private _released;

    /* @Dev: Array of all the addresses that recive currency. */
   address[] private _holders;


     constructor(address _seller, uint256 _remainder, uint256 pannels, address[] memory holdersList, uint256[] memory shares_, uint256 priceOfProduct) ERC20("Sunified", "SUN") {
         price = priceOfProduct;
         seller = _seller;
         _shares[_seller] = _remainder;
        for (uint256 i = 0; i < holdersList.length; i++) {
             _holders.push(holdersList[i]);
            _shares[holdersList[i]] = shares_[i];
            _totalShares = 220 * pannels;
            _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
            _grantRole(DISTRIBUTOR_ROLE, msg.sender);
            _mint(holdersList[i], shares_[i]);
    }
    }

    /**
     * @dev The Wrapped currency received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Wrapped currency without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Wrapped currency.
     *
     * To learn more about this see the Solidity documentation for
     * https://solidity.readthedocs.io/en/latest/contracts.html#fallback-function[fallback
     * functions].
     */

    /**
     * @dev Getter for the total shares held by holders.
     */
    function totalShares() public view returns (uint256) {
        return _totalShares;
    }

    /**
     * @dev Getter for the total amount of Wrapped currency already released.
     */
    function totalReleased() public view returns (uint256) {
        return _totalReleased;
    }


    /**
     * @dev Getter for the amount of shares held by an account.
     */
    function shares(address account) public view returns (uint256) {
        return _shares[account];
    }

    /**
     * @dev Getter for the amount of Wrapped currency already released to a payee.
     */
    function released(address account) public view returns (uint256) {
        return _released[account];
    }


    /**
     * @dev Getter for the address of the holder number `index`.
     */
    function holders(uint256 index) public view returns (address) {
        return _holders[index];
    }

    /**
     * @dev Getter for the amount of holder's Wrapped currency in contract.
     */
    function releasable(address account) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + totalReleased();
        return _pendingPayment(account, totalReceived, released(account));
    }

    /**
     * @dev Triggers a transfer to `account` of the amount of Wrapped currency they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */

    function release(address payable account) public virtual {
        require(_shares[account] > 0, "ACCOUNT_HAS_NO_SHARES");

        uint256 payment = releasable(account);

        // _totalReleased is the sum of all values in _released.
        // If "_totalReleased += payment" does not overflow, then "_released[account] += payment" cannot overflow.
        _totalReleased += payment;
        unchecked {
            _released[account] += payment;
        }

        Address.sendValue(account, payment);
        emit PaymentReleased(account, payment);
    }

    /**
     * @dev Triggers a transfer to all holders of the amount of Wrapped currency they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */

    function releaseAll() external {
          for (uint i; i < _holders.length; i++) {
              uint256 payment = releasable(_holders[i]);
        _totalReleased += payment;
        unchecked {
            _released[_holders[i]] += payment;
        }

        address payable account = payable(address(_holders[i]));

        Address.sendValue(
            account, 
            payment);
        emit PaymentReleased(_holders[i], payment);
          }
    }


    /**
     * @dev internal logic for computing the pending payment of an `account` given the token historical balances and
     * already released amounts.
     */
    function _pendingPayment(
        address account,
        uint256 totalReceived,
        uint256 alreadyReleased
    ) private view returns (uint256) {
        return (totalReceived * _shares[account]) / _totalShares - alreadyReleased;
    }

    /*
    @Dev: function to adjust price based on market.
    */

    function adjustPrice(uint256 newPrice) external onlyRole(DISTRIBUTOR_ROLE){
        price = newPrice;

    }
    /**  
    ================================================
    |        Adjustments to holders                |
    ================================================
    **/

    /* 
    @Dev: This view function checks if address is in the holders array to aviod duplicates. 
    */

      //
    function isOriginalAddress(address holder) public view returns (bool) {
    for (uint i = 0; i < _holders.length; i++) {
        if (_holders[i] == holder) {
            return false;
        }
    }

    return true;
    }

    /*
    @Dev: New Pannel
    */
    function newPannel(uint256 amountOfPannels) external onlyRole(DISTRIBUTOR_ROLE){
        uint256 newInventory = amountOfPannels * 220;
        uint256 currentShares = _shares[msg.sender];
        uint256 newSellerSharesTotal = newInventory + currentShares;
        _shares[msg.sender] = newSellerSharesTotal;
        _totalShares += newInventory;
        emit SharesAdjusted(seller, newInventory);

    }


    /*
    @Dev: Adjusts the total number of shares recieved by an address
    */

    function sellSharesFromSellerAddress(uint256 shares_) external payable {
        require(shares_ * price == msg.value, "NOT_ENOUGH_CURRENCY");
        require(shares_ > 0, "NO_SPAMMING");
        _shares[seller] -= shares_;
        _shares[msg.sender] += shares_;
        _mint(msg.sender, shares_);
        if(isOriginalAddress(msg.sender) == false){
            _holders.push(msg.sender);
        }
         emit SharesAdjusted(msg.sender, shares_);
    }

     /*
    @Dev: Trades out one holder for another. 
    */

    function sendAllShares(
        uint256 _index,
        address _newholderRewardAddress
    ) external  {
        require(
            _holders[_index] == msg.sender,
            "NOT_YOUR_SHARES"
        );
        address previousAddress = _holders[_index];
        uint256 sharesAdjusted = _shares[previousAddress];
        _shares[previousAddress] = 0;
        _shares[_newholderRewardAddress] = sharesAdjusted;
        _holders[_index] = _newholderRewardAddress;   
        emit Updatedholder(previousAddress, _newholderRewardAddress);
    } 
      
}