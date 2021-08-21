const router = express.Router;

router
  .get('/', (req,res) => {
    console.log('in get for user endpoint')
  })

///not using this yet