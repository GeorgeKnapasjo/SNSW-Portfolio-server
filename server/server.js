const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const storage = require('node-persist');
const reviews = require('../Reviews.json');

(async () => {
    await storage.init({ dir: "./data" });
    // for(let r of reviews){
    //     await storage.setItem(`review-${r.id}`.toString(), r)
    // }
    const server = express();
    server.use(bodyParser.json());
    server.use(express.json());
    server.use(cors());

    server.get('/reviews', async (req, res) => {
        let reviews = await storage.values()
        res.json(reviews)
    })

    server.post('/reviews', async (req, res) => {
        if (req.body.rating > 5) {
            res.json({ status: 500, message: 'Error: please enter a valid rating out of 5' })
        }
        else if (req.body.name == '') {
            res.json({ status: 500, message: 'Error: please enter a valid name' })

        }
        else if (req.body.name.includes('1')
            || (req.body.name.includes('2'))
            || (req.body.name.includes('3'))
            || (req.body.name.includes('4'))
            || (req.body.name.includes('5'))
            || (req.body.name.includes('6'))
            || (req.body.name.includes('7'))
            || (req.body.name.includes('8'))
            || (req.body.name.includes('9'))
            || (req.body.name.includes('0'))
            ){
            res.json({ status: 500, message: 'Error: please enter a valid name' })

        }
        else if (req.body.description == '') {
            res.json({ status: 500, message: 'Error: please enter a valid description' })

        }

        else {
            let reviews = await storage.values()
            let highest = 0
            for (let i = 0; i < reviews.length; i++) {
                if (reviews[i].id > highest) {
                    highest = reviews[i].id
                }
            }
            let review = {
                id: ++highest,
                name: req.body.name,
                rating: req.body.rating,
                message: req.body.message
            }
            await storage.setItem(`review-${review.id}`.toString(), review)
            res.json({ status: 200, message: review })
        }
    })

    const PORT = process.env.PORT || 4000;

    server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
})()