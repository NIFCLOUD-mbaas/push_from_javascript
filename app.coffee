$ ->
  NCMB.initialize("APPLICATION_KEY", "CLIENT_KEY");

  $("form").on "submit", (e) ->
    e.preventDefault()
    message = $("#message").val()
    NCMB.Push.send
      message: message
      immediateDeliveryFlag: true
      target: ['ios']
      searchCondition: {}
    .then (e) ->
      console.info "success", e
      $(".message").addClass("alert alert-success").html "作成されました"
      setTimeout (e) ->
        $(".message").removeClass("alert alert-success").html ""
      , 3000
    , (e) ->
      console.error "error", e
    false