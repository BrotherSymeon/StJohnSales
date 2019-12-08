


module.exports = (db) => {

  let dashboardController = {};

  dashboardController.dashboard = async (req, res) => {
    const orders = new db.Orders();
    try{
      var year = new Date().getFullYear();
      var etsyMonthlyData = await db.Orders.OrderAmountsByMonth(year, 'ETSY')
      var etsyQuarterlyData = await db.Orders.OrderAmountsByQuarter(year, 'ETSY');
      var squareMonthlyData = await db.Orders.OrderAmountsByMonth(year, 'SQUARE');
      var squareQuarterlyData = await db.Orders.OrderAmountsByQuarter(year, 'SQUARE');

      res.locals.etsyMonthlyData = etsyMonthlyData;
      res.locals.etsyQuarterlyData = etsyQuarterlyData;
      res.locals.squareMonthlyData = squareMonthlyData;
      res.locals.squareQuarterlyData = squareQuarterlyData;

      return res.render('index', { title : 'St Johns Sales'});

    }catch(err){
      console.log('dashboard error:')
      console.log(err.message);
      return res.render('index', { title : 'St Johns Sales'});
    }


  };


  return dashboardController;

 

};