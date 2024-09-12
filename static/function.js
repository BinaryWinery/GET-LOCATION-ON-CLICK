const params = new URLSearchParams(window.location.search);
const videoLink = (params.get('youtube')!=null)?params.get('youtube'):"8U2QgjgG180"
const youtubeLink = `https://www.youtube.com/embed/${videoLink}`
const mainDiv = document.getElementById("mainDiv")
mainDiv.innerHTML = `<iframe  style="height: 100vh; width: 100%;" id="video"
src="${youtubeLink}" 
frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
allowfullscreen>
</iframe>`