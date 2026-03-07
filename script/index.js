// manage card status
const manageCardCount = () => {
  const count = document.getElementById("cardCount");
  const cardContainer = document.getElementById("card-container");
  count.innerText = cardContainer.children.length;
};

// create level badge item
const createElement = (arr) => {
  const element = arr.map(
    (el) => `
        <div class="badge badge-soft badge-error">
            <span class="bug-btn hidden"><i class="fa-solid fa-bug"></i></span>
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
  return element.join(' ');
};

// load all issue

const loadAllIssues = async () => {
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  displayAllIssues(data.data);
};

const displayAllIssues = (issues) => {
  const cardContainer = document.getElementById("card-container");
  issues.forEach((issue) => {
    const card = document.createElement("div");
    card.classList.add("p-8", "shadow-lg", "rounded-lg");
    card.innerHTML = `
            <!-- card -->
          <div class="  ">
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
    cardContainer.appendChild(card);
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
  });
  manageCardCount();
};

loadAllIssues();
