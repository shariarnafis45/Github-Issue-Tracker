// create level badge item
const createElement = (arr) => {
  const element = arr.map(
    (el) => `
        <div class="badge badge-soft badge-error label-badge mr-1.5 mt-2">
            <span class="btn-bug hidden"><i class="fa-solid fa-bug"></i></span>
            <span class="help-btn hidden"
            ><i class="fa-solid fa-life-ring"></i
            ></span>
            <span class="enhance-btn hidden"><i class="fa-regular fa-star-half-stroke"></i></span>
            <span class="first-issue-btn hidden"><i class="fa-solid fa-thumbs-up"></i></span>
            <span class="documentation-btn hidden"><i class="fa-brands fa-readme"></i></span>
            <span class="font-medium">${el.toUpperCase()}</span>
        </div>
    `,
  );
  return element.join(" ");
};
// spinner controll
const controllSpinner = (value) => {
  const spinner = document.getElementById("spinner");

  if (value) {
    spinner.classList.remove("hidden");
  } else {
    spinner.classList.add("hidden");
  }
};

// remove active class from tab btn
const removeActive = () => {
  const filterBtn = document.querySelectorAll(".filter-tab-btn");
  filterBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
};

// Show Modal
const showModalDetails = async (id) => {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const data = await res.json();
  const modalContentContainer = document.getElementById(
    "modal-content-container",
  );
  ((modalContentContainer.innerHTML = `
      <div class="">
        <h2 class="text-xl font-bold">${data.data.title}</h2>
        <div class="flex gap-1.5 mt-3">
          <div class="badge badge-success border-none open-close-modal-badge">${data.data.status}</div>
          <p class="text-gray-500">
            &#8226; ${data.data.status} by ${data.data.author} &#8226;
            <span>${new Date(data.data.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
        <div class="mt-4">
          <!-- badge load here dynamically -->
          ${createElement(data.data.labels)}
        </div>
        <p class="text-gray-500 mt-4">${data.data.description}</p>
        <div class="flex gap-3 mt-5">
          <div class="bg-gray-100 p-2 rounded-md w-full">
            <p class="text-gray-500">Assignee:</p>
            <h3 class="font-semibold">${data.data.author}</h3>
          </div>
          <div class="bg-gray-100 p-2 rounded-md w-full">
            <p class="text-gray-500">Priority:</p>
            <div class="badge badge-soft badge-error priority-badge">
              ${data.data.priority}
            </div>
          </div>
        </div>
      </div>
  `),
    // Show the modal
    document.getElementById("cardModal").showModal());

  // border add
  if (`${data.data.status}` === "open") {
    document
      .querySelector(".open-close-modal-badge")
      .classList.add("badge-open");
  } else {
    document
      .querySelector(".open-close-modal-badge")
      .classList.add("badge-closed");
  }

  // priority badge color controll
  if (`${data.data.priority}` === "high") {
    modalContentContainer
      .querySelector(".priority-badge")
      .classList.add("priority-high");
  } else if (`${data.data.priority}` === "medium") {
    modalContentContainer
      .querySelector(".priority-badge")
      .classList.add("priority-medium");
  } else {
    modalContentContainer
      .querySelector(".priority-badge")
      .classList.add("priority-low");
  }

  // label style & icon controll
  const labelBadges = modalContentContainer.querySelectorAll(".label-badge");
  labelBadges.forEach((labelBadge) => {
    const labelBadgeText = labelBadge.textContent.trim().toLocaleLowerCase();
    if (labelBadgeText === "bug") {
      labelBadge.classList.add("label-bug");
      labelBadge.querySelector(".btn-bug").classList.remove("hidden");
    } else if (labelBadgeText === "help wanted") {
      labelBadge.classList.add("label-help");
      labelBadge.querySelector(".help-btn").classList.remove("hidden");
    } else if (labelBadgeText === "enhancement") {
      labelBadge.classList.add("label-enhancement");
      labelBadge.querySelector(".enhance-btn").classList.remove("hidden");
    } else if (labelBadgeText === "good first issue") {
      labelBadge.classList.add("label-first-issue");
      labelBadge.querySelector(".first-issue-btn").classList.remove("hidden");
    } else if (labelBadgeText === "documentation") {
      labelBadge.classList.add("label-documentation");
      labelBadge.querySelector(".documentation-btn").classList.remove("hidden");
    } else {
      labelBadge.classList.add("default-label");
    }
  });
};

// event delegation in filter btn tab
document
  .getElementById("tab-btn-container")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("filter-tab-btn")) {
      removeActive();
      event.target.classList.add("active");
    }
  });
// manage card status
const manageCardCount = () => {
  const count = document.getElementById("cardCount");
  const cardContainer = document.getElementById("card-container");
  count.innerText = cardContainer.children.length;
};

// load all issue

const loadAllIssues = async () => {
  controllSpinner(true);
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  displayAllIssues(data.data);
};

const displayAllIssues = (issues) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  issues.forEach((issue) => {
    const card = document.createElement("div");
    card.classList.add("p-8", "shadow-lg", "rounded-lg");
    card.innerHTML = `
            <!-- card -->
          <div onclick="showModalDetails(${issue.id})" class="  ">
            <!-- icon + priority badge-->
            <div class="flex justify-between">
              <div class="flex">
                <div
                  id=""
                  class="bg-[#F0E2FF] p-1 rounded-full flex items-center justify-center hidden close-icon"
                >
                  <i
                    class="fa-regular fa-circle-check text-xl text-[#A855F7]"
                  ></i>
                </div>
                <div
                  id=""
                  class="bg-[#CBFADB] p-1 rounded-full flex items-center justify-center hidden open-icon"
                >
                  <i
                    class="fa-regular fa-circle-dot text-[#00A96E] text-xl"
                  ></i>
                </div>
              </div>
              <!-- priority badge -->
              <div>
                <div class="badge badge-soft badge-error priority-badge">${issue.priority}</div>
              </div>
            </div>
            <!-- content -->
            <div class="space-y-2.5">
              <h2 class="text-xl font-medium mt-4">
               ${issue.title}
              </h2>
              <p class="text-gray-500">
                ${issue.description}
              </p>
            </div>
            <!-- labels  -->
            <div class="mt-3">
              ${createElement(issue.labels)}
                
            </div>
            <!-- author details -->
            <div class="mt-5 border-t-1 border-gray-300 pt-4 space-y-1">
              <p class="text-gray-500">#${issue.id} by ${issue.author}</p>
              <p class="text-gray-500">${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        `;

    // border add
    if (`${issue.status}` === "open") {
      card.classList.add("border-open");
      card.querySelector(".open-icon").classList.remove("hidden");
    } else {
      card.classList.add("border-close");
      card.querySelector(".close-icon").classList.remove("hidden");
    }

    // priority badge color controll
    if (`${issue.priority}` === "high") {
      card.querySelector(".priority-badge").classList.add("priority-high");
    } else if (`${issue.priority}` === "medium") {
      card.querySelector(".priority-badge").classList.add("priority-medium");
    } else {
      card.querySelector(".priority-badge").classList.add("priority-low");
    }

    // label style & icon controll
    const labelBadges = card.querySelectorAll(".label-badge");
    labelBadges.forEach((labelBadge) => {
      const labelBadgeText = labelBadge.textContent.trim().toLocaleLowerCase();
      if (labelBadgeText === "bug") {
        labelBadge.classList.add("label-bug");
        labelBadge.querySelector(".btn-bug").classList.remove("hidden");
      } else if (labelBadgeText === "help wanted") {
        labelBadge.classList.add("label-help");
        labelBadge.querySelector(".help-btn").classList.remove("hidden");
      } else if (labelBadgeText === "enhancement") {
        labelBadge.classList.add("label-enhancement");
        labelBadge.querySelector(".enhance-btn").classList.remove("hidden");
      } else if (labelBadgeText === "good first issue") {
        labelBadge.classList.add("label-first-issue");
        labelBadge.querySelector(".first-issue-btn").classList.remove("hidden");
      } else if (labelBadgeText === "documentation") {
        labelBadge.classList.add("label-documentation");
        labelBadge
          .querySelector(".documentation-btn")
          .classList.remove("hidden");
      } else {
        labelBadge.classList.add("default-label");
      }
    });

    // apend the card
    cardContainer.appendChild(card);
  });
  controllSpinner(false);
  manageCardCount();
};

// open tab btn controll
const loadOpenIssue = async () => {
  controllSpinner(true);
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  const issues = data.data;
  const openIssue = issues.filter((issue) => issue.status === "open");
  displayAllIssues(openIssue);
};
// close tab btn controll
const loadClosedIssue = async () => {
  controllSpinner(true);
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  const issues = data.data;
  const closeIssue = issues.filter((issue) => issue.status === "closed");
  displayAllIssues(closeIssue);
};

loadAllIssues();
