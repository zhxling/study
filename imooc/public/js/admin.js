$(function(){
  $(".del").click(function(e){
    var target=e.target;
    var id=target.dataset.id;
    var tr=$('.item-id-'+id);

    $.ajax({
      type:'DELETE',
      url:'/admin/list/delete/?id='+id
    })
    .done(function(res){
      if(res.success){
        if(tr.length>0){
          tr.remove();
        }
      }
    })
  })
})