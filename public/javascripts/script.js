function addtoCart(proId){
    
    $.ajax({
      url:'/add-to-cart/'+proId,
      method:'get',
      success:(response)=>{
          if(response.status){
              let count = $('#cart-count').html()
              conut = parseInt(count)+1
              $('#cart-count').html(count)
          }

      }

    })
  }