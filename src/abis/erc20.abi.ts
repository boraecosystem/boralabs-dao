export const IERC20 = [
  'function symbol() external view returns (string memory)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address recipient, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)',
  'function mint() public',
  'function mintMap(address account) public view returns (bool)',
  // VOTES
  'function delegate(address delegatee) public',
  'function delegates(address account) public view returns (address)',
  'function getPastTotalSupply(uint256 timepoint) public view returns (uint256)'
];
