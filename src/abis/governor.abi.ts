export const IGovernor = [
  'function votingDelay() public view returns (uint256)',
  'function votingPeriod() public view returns (uint256)',
  'function proposalThreshold() public view returns (uint256)',
  'function name() public view returns (string memory)',
  'function clock() public view returns (uint48)',
  'function propose(address[] targets,uint256[] values,bytes[] calldatas,string description) public returns (uint256)',
  'event ProposalCreated(uint256 proposalId,address proposer,address[] targets,uint256[] values,string[] signatures,bytes[] calldatas,uint256 voteStart,uint256 voteEnd,string description)',
  'event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)',
  'function state(uint256 proposalId) public view returns (uint8)',
  'function hasVoted(uint256 proposalId, address account) public view returns (bool)',
  'function proposalVotes(uint256 proposalId) public view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)',
  'function castVote(uint256 proposalId, uint8 support) public returns (uint256)',
  'function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) public payable returns (uint256)',
  'function hashProposal(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) public pure returns (uint256)'
];
