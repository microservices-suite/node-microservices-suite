const getCustomerReport = async(req,res) => {
    try {
        res.status(200).send({data : ["This is getCustomerReport"]})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getCustomerReport
}