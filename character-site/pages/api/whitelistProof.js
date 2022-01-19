import cors from 'cors';
import cache from 'express-redis-cache';

const c = cache();

const run = (req, res) => (fn) => new Promise((resolve, reject) => {
  fn(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
  )
})

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
let whitelist = require('../../data/whitelist.json');
const hashedAddresses = whitelist.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });


const handler = async (req, res) => {

    return new Promise((resolve, reject) => {
        try {
            var req_body = '';
            req.on('data', function (data) {
                req_body += data;
                if (req_body.length > 1e6)
                    req.connection.destroy();
            });
            req.on('end', function () {
                let post_data =  JSON.parse(req_body);
                let address = post_data["address"];
               
                // const address = req.query.address;

                if (!address) {
                    res.status(400).json({ msg: "address is required"});
                    return;
                }

                const hashedAddress = keccak256(address);
                const proof = merkleTree.getHexProof(hashedAddress);
                const root = merkleTree.getHexRoot();

                // just for front-end display convenience
                // proof will be validated in smart contract as well
                const valid = merkleTree.verify(proof, hashedAddress, root);

                res.status(200).json({
                    address,
                    proof,
                    valid,
                });
            });
        } catch (error) {
            res.json({code: 999, error, message: `Unable to fetch data on ${req.route.path}` })
        }
    });


//   const middleware = run(req, res);
//   await middleware(cors());
// //   await middleware(c.route());

//   /** validate req type **/
//   if (req.method !== 'GET') {
//     res.status(400).json({});
//     return;
//   }

//   const address = req.query.address;

//   if (!address) {
//     res.status(400).json({ msg: "address is required"});
//     return;
//   }

//   const hashedAddress = keccak256(address);
//   const proof = merkleTree.getHexProof(hashedAddress);
//   const root = merkleTree.getHexRoot();

//   // just for front-end display convenience
//   // proof will be validated in smart contract as well
//   const valid = merkleTree.verify(proof, hashedAddress, root);

//   res.status(200).json({
//     address,
//     proof,
//     valid,
//   });
}

export default handler