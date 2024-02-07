$(document).ready(()=>{

    setTimeout(() => {
        //No dragear imagenes
        $('img').on('dragstart', function(event) { event.preventDefault(); });
    }, 120);

});