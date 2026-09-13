document.addEventListener("DOMContentLoaded", () => {
  // ----- Demo example tabs -----
  const tabs = document.querySelectorAll(".tab-btn");
  const videos = document.querySelectorAll("[data-video]");

  function loadExample(id) {
    videos.forEach((v) => {
      const method = v.getAttribute("data-video");
      const src = `project_page/videos/${id}/${method}.mp4`;
      if (v.querySelector("source").getAttribute("src") !== src) {
        v.querySelector("source").setAttribute("src", src);
        v.load();
        v.play().catch(() => {});
      }
    });
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadExample(btn.dataset.example);
    });
  });
});
