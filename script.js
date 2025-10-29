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




const dateElement = document.getElementById("date")
const visitElement = document.getElementById("numberOfVisits")
const timeline = document.getElementById("timeline")

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
  if (i === 0) {
    const current = percentages[i];
    sections.push({ from: 0, to: current.from })
    sections.push(current);
    continue; 
  } else if (i + 1 === percentages.length) {
    const current = percentages[i];
    sections.push(current);
    sections.push({ from: current.to, to: 100 })
    continue
  }
  const current = percentages[i];
  const next = percentages[i + 1];
  sections.push(current);
  if (next) {
    sections.push({ from: current.to, to: next.from }); // gap between them
  }
}

sections.sort((a,b) => (a.from - b.from));
sections.forEach((val, idx) => {
  if (val.hasOwnProperty("mid")) {
    const circle = document.createElement("div")
    circle.className = "visit"
    timeline.appendChild(circle)
  } else {  
    if (idx === 0 || idx + 1 === sections.length) {
      const empty = document.createElement("div")
      empty.className = `empty${idx} empty-space`
      empty.style.width = `${val.to - val.from}%`
      timeline.appendChild(empty)
    } else {
      if ((sections[idx+1].from - sections[idx-1].to) < INTERVAL) {
      } else {
        const empty = document.createElement("div")
        empty.className = `empty${idx} empty-space`
        empty.style.width = `${val.to - val.from}%`
        timeline.appendChild(empty)

      }
    }
  }
})




console.log(percentages)
console.log(sections)