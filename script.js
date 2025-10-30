const dateElement = document.getElementById("date")
const visitElement = document.getElementById("numberOfVisits")
const timeline = document.getElementById("timeline")
const data = [{
    "from": "2023-05-30T05:56:28+00:00",
    "to": "2023-05-30T05:57:10+00:00",
}, {
    "from": "2023-05-30T06:01:01+00:00",
    "to": "2023-05-30T06:49:31+00:00",
}, {
    "from": "2023-05-30T07:04:21+00:00",
    "to": "2023-05-30T07:05:26+00:00",
}, {
    "from": "2023-05-30T08:27:42+00:00",
    "to": "2023-05-30T08:28:52+00:00",
}, {
    "from": "2023-05-30T08:29:43+00:00",
    "to": "2023-05-30T08:31:28+00:00",
}, {
    "from": "2023-05-30T10:19:15+00:00",
    "to": "2023-05-30T10:21:02+00:00",
}, {
    "from": "2023-05-30T16:50:26+00:00",
    "to": "2023-05-30T16:50:49+00:00",
}, {
    "from": "2023-05-30T17:03:12+00:00",
    "to": "2023-05-30T17:04:24+00:00",
}, {
    "from": "2023-05-30T17:05:11+00:00",
    "to": "2023-05-30T17:05:55+00:00",
}, {
    "from": "2023-05-30T19:29:46+00:00",
    "to": "2023-05-30T19:31:04+00:00",
}, {
    "from": "2023-05-30T20:42:28+00:00",
    "to": "2023-05-30T20:43:31+00:00",
}]

const date = new Date(data[0].from)
const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
})
const parts = formatter.formatToParts(date)
const weekday = parts.find(p => p.type === "weekday").value
const day = parts.find(p => p.type === "day").value
const month = parts.find(p => p.type === "month").value
const formattedDate = weekday + " " + day + " " + month
dateElement.textContent = formattedDate
visitElement.textContent = data.length + " visits"








const TOTAL_MINUTES = 1440;
const INTERVAL = parseFloat((15 / TOTAL_MINUTES * 100).toFixed(2))

function getMinutes(dateStr) {
  const date = new Date(dateStr);
  return date.getHours() * 60 + date.getMinutes();
}

const percentages = []
const sections = []


data.forEach((val, i) => {
  const from = getMinutes(val.from) 
  const to = getMinutes(val.to) 
  const mid = (from + to) / 2
  percentages.push({
    from: parseFloat((from / TOTAL_MINUTES * 100).toFixed(2)),
    mid: parseFloat((mid / TOTAL_MINUTES * 100).toFixed(2)),
    to: parseFloat((to / TOTAL_MINUTES * 100).toFixed(2)),
  })
})


for (let i = 0; i < percentages.length; i++) {
  const current = percentages[i];
  const next = percentages[i + 1];

  if (i === 0 && current.from > 0) {
    sections.push({ from: 0, to: current.from });
  }

  if (next) {
    const gap = next.from - current.to;
    const percentGap = next.mid - current.to;

    if (gap <= INTERVAL) {
      sections.push({ ...current, gap: percentGap});
    } else {
      sections.push(current);
      if (gap > 0) {
        sections.push({ from: current.to, to: next.from });
      }
    }
  } else {
    sections.push(current);
    if (current.to < 100) {
      sections.push({ from: current.to, to: 100 });
    }
  }
}
sections.sort((a, b) => (a.from - b.from));



let zIdx = 1;

sections.forEach((val, idx) => {
  if (val.hasOwnProperty("mid")) {
    const circle = document.createElement("div");
    circle.className = "visit";
    if (val.hasOwnProperty("gap")) {
      const overlap = val.gap; 
      circle.style.marginRight = `-8px`; 
    }

    circle.style.zIndex = zIdx++; 
    timeline.appendChild(circle);
  } else {
    const empty = document.createElement("div");
    empty.className = "empty-space";
    empty.style.width = `${val.to - val.from}%`; 
    timeline.appendChild(empty);
  }
});




console.log(percentages)
console.log(sections)