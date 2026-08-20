export type LaunchReviewSeed = {
  reviewerDisplayName: string;
  rating: number;
  reviewText: string;
  reviewCreatedAt: string;
};

/** 4★ and 5★ Google reviews for public launch — excludes owner replies and negative sarcastic reviews. */
export const LAUNCH_GOOGLE_REVIEWS: LaunchReviewSeed[] = [
  { reviewerDisplayName: "Monika Wooten", rating: 5, reviewText: "I needed an inspection done on my septic in a pinch. Slade came out and was able to get it done quickly and efficiently.", reviewCreatedAt: "2026-08-18" },
  { reviewerDisplayName: "Danny CoastalColors", rating: 5, reviewText: "Great company and owner!! Highly recommend!!", reviewCreatedAt: "2026-07-30" },
  { reviewerDisplayName: "Leslie Tullis", rating: 5, reviewText: "TJ is amazing", reviewCreatedAt: "2026-07-09" },
  { reviewerDisplayName: "David Turner", rating: 5, reviewText: "I needed our septic tanks pumped and inspected. I called Septic Tank Man, they immediately answered the phone and were responsive.", reviewCreatedAt: "2026-06-11" },
  { reviewerDisplayName: "Sue Gottesman", rating: 5, reviewText: "TJ came out yesterday. I wanted to understand the process and he was awesome at explaining how he does what he does.", reviewCreatedAt: "2026-05-21" },
  { reviewerDisplayName: "Andrew Gottesman", rating: 5, reviewText: "I wish to express much thanx to Septic Tank Man, Inc. and particularly to their technician TJ. We had our tank pumped and he was professional.", reviewCreatedAt: "2026-05-21" },
  { reviewerDisplayName: "Matthew Mativi", rating: 5, reviewText: "Great price. Big THANK YOU to Septic Tank Man for always taking great care of us. TJ came out today for a pump.", reviewCreatedAt: "2026-04-16" },
  { reviewerDisplayName: "Becca Anastasi", rating: 5, reviewText: "Huge thanks to TJ at Septic Tank Man for the prompt and professional service today. He was super knowledgeable.", reviewCreatedAt: "2026-02-19" },
  { reviewerDisplayName: "Janice Walker", rating: 5, reviewText: "TJ came to our home quickly and was great and personable.", reviewCreatedAt: "2026-02-05" },
  { reviewerDisplayName: "Rica Man", rating: 5, reviewText: "I had a great experience with Septic Tank Man and will always use them in the future. Corey and TJ were very professional and knowledgeable.", reviewCreatedAt: "2026-01-22" },
  { reviewerDisplayName: "Jose González", rating: 5, reviewText: "On October 17th 2025, job #6480, the technician who came out did a very thorough inspection of my septic system.", reviewCreatedAt: "2026-01-08" },
  { reviewerDisplayName: "Renee Jayhan", rating: 5, reviewText: "I had a great experience with this septic tank company from start to finish. They were prompt, professional, and very helpful.", reviewCreatedAt: "2025-12-18" },
  { reviewerDisplayName: "Don Hauptmann", rating: 5, reviewText: "TJ came to pump out my tanks, he was very friendly and professional. I would definitely recommend him and use him again!", reviewCreatedAt: "2025-12-04" },
  { reviewerDisplayName: "Crystal Motuzas", rating: 5, reviewText: "We had an excellent experience with Septic Tank Man! TJ came out to pump our septic tank and was knowledgeable and professional.", reviewCreatedAt: "2025-09-25" },
  { reviewerDisplayName: "Armando Vazquez", rating: 5, reviewText: "Quick to respond and efficient. TJ and Slade did work in our home and so far we've been very pleased. I would recommend them for your septic issues.", reviewCreatedAt: "2025-08-20" },
  { reviewerDisplayName: "Terry Hawks", rating: 5, reviewText: "Tj did a class act of a Job", reviewCreatedAt: "2025-05-12" },
  { reviewerDisplayName: "R & J Thurston", rating: 5, reviewText: "TJ and Anthony showed up today, and what a great experience. They were courteous and professional, on time.", reviewCreatedAt: "2024-09-16" },
  { reviewerDisplayName: "camp winaco", rating: 5, reviewText: "TJ came out to our house and checked our septic tank. Came on time, told us what our options were in a very clear way.", reviewCreatedAt: "2024-08-15" },
  { reviewerDisplayName: "Shannon Thomas", rating: 5, reviewText: "I was very happy with TJ and how courteous, knowledgeable and thorough he was with my service today.", reviewCreatedAt: "2024-07-26" },
  { reviewerDisplayName: "Mary Waldeck", rating: 5, reviewText: "TJ came to the rescue today, and provided excellent and prompt service on one of our rental properties. We will definitely call him in the future.", reviewCreatedAt: "2024-06-26" },
  { reviewerDisplayName: "Rachel Benton", rating: 5, reviewText: "TJ was so kind and helpful! He went above and beyond to explain everything. I will be recommending The Septic Tank Man to everyone!", reviewCreatedAt: "2024-05-29" },
  { reviewerDisplayName: "anita dynarski", rating: 5, reviewText: "TJ did an excellent job and was very professional. I am very satisfied with his service and the next time I will call I would ask for him.", reviewCreatedAt: "2024-05-16" },
  { reviewerDisplayName: "andrew leichty", rating: 5, reviewText: "TJ was the man! Very knowledgeable and informative! He was very thorough and made sure I understood the process and each step!", reviewCreatedAt: "2024-05-16" },
  { reviewerDisplayName: "Yac", rating: 5, reviewText: "Thank you Shaina and TJ for outstanding service! I am now educated about caring for my septic system.", reviewCreatedAt: "2024-05-10" },
  { reviewerDisplayName: "Craig Hop", rating: 5, reviewText: "Thank you Slade for sending TJ! Excellent job! Outstanding young man. I highly recommend STM for all of your septic needs.", reviewCreatedAt: "2024-04-26" },
  { reviewerDisplayName: "Sharon Hundley", rating: 5, reviewText: "TJ did an excellent job!! On time, courteous, knowledgeable and very thorough. Would highly recommend.", reviewCreatedAt: "2024-04-23" },
  { reviewerDisplayName: "David Warren", rating: 5, reviewText: "TJ was great! On time, very knowledgeable and made sure we understood everything.", reviewCreatedAt: "2024-04-05" },
  { reviewerDisplayName: "Jeffrey Reichard", rating: 5, reviewText: "Wow, what a great young man, TJ!!! He explained everything to me. He was so pleasant, knowledgeable and professional.", reviewCreatedAt: "2024-03-20" },
  { reviewerDisplayName: "Karen", rating: 5, reviewText: "TJ came out for a pump out. Showed us everything he did. Was very informative. He did a great job and cleaned up after himself.", reviewCreatedAt: "2024-03-07" },
  { reviewerDisplayName: "Aaron Jackson", rating: 5, reviewText: "Outstanding service! They were responsive, efficient and professional. The technician that did the work was excellent.", reviewCreatedAt: "2024-02-22" },
  { reviewerDisplayName: "True Blue", rating: 5, reviewText: "TJ was very professional, on time and knew what he was talking about! Pleasant experience and we will use this company again!", reviewCreatedAt: "2024-02-12" },
  { reviewerDisplayName: "Daryl Leto", rating: 5, reviewText: "I normally dont fill these things out but i had to today. TJ did a great job he treated us with respect and professionalism.", reviewCreatedAt: "2024-02-07" },
  { reviewerDisplayName: "Lester Byler", rating: 5, reviewText: "I highly recommend this company for septic tank pump out. TJ was very polite, knowledgeable and professional and did an excellent job.", reviewCreatedAt: "2024-01-31" },
  { reviewerDisplayName: "Aaron Rositch", rating: 5, reviewText: "Awesome service! Had a surprise issue that needed to be dealt with. They came out the day after I called, just as they promised.", reviewCreatedAt: "2024-01-26" },
  { reviewerDisplayName: "Keven Knight", rating: 5, reviewText: "I saw a lot of five-star reviews and now I know why. TJ went above and beyond, doing more than just pumping out our tank.", reviewCreatedAt: "2024-01-24" },
  { reviewerDisplayName: "Ben Soto", rating: 5, reviewText: "I was having issues with my toilets bubbling every time i took a shower. So i called to get a pump out. They had someone out quickly.", reviewCreatedAt: "2024-01-18" },
  { reviewerDisplayName: "Christy Thomas", rating: 5, reviewText: "So glad I called these guys !! My tech, TJ, was awesome !!! Super friendly and very informative with every question I had !!", reviewCreatedAt: "2023-11-28" },
  { reviewerDisplayName: "Beth Lowe", rating: 5, reviewText: "Service was so fast and couldn't have been better. Tj did a great job and shaina also did great setting everything up so promptly. Thank you", reviewCreatedAt: "2023-11-28" },
  { reviewerDisplayName: "Chester Jones", rating: 5, reviewText: "TJ was very professional and appreciated his knowledge about the septic system with lots of good hints for care. The price and quality of service were excellent.", reviewCreatedAt: "2023-10-27" },
  { reviewerDisplayName: "Mrs. Fulgieri", rating: 5, reviewText: "TJ was very quick to respond to our emergency on a Saturday. He explained everything and made sure we were satisfied before he left.", reviewCreatedAt: "2023-10-21" },
  { reviewerDisplayName: "Gregory Sprimont", rating: 5, reviewText: "Called on a Thursday, TJ came out next working day. He was on time and called when on the way. T.J. was very professional.", reviewCreatedAt: "2023-10-06" },
  { reviewerDisplayName: "Daryle Persson", rating: 5, reviewText: "TJ came out to pump out my septic and was on time and very professional definitely using Septic Tank Man in the future.", reviewCreatedAt: "2023-10-02" },
  { reviewerDisplayName: "Robin Rinker", rating: 5, reviewText: "If you want amazing service, on time and professional services, Septic Tank Man can help you out in a pinch.", reviewCreatedAt: "2023-09-22" },
  { reviewerDisplayName: "Emily Leach", rating: 5, reviewText: "TJ, who came out for our service, was great. He was very knowledgeable, explained everything thoroughly, made sure to answer all of our questions.", reviewCreatedAt: "2023-09-12" },
  { reviewerDisplayName: "Jim Markowski", rating: 5, reviewText: "Called on a Friday, came out next working day. We're on time and called when on the way. T.J. was very professional.", reviewCreatedAt: "2023-09-07" },
  { reviewerDisplayName: "Lisa Bruewer", rating: 5, reviewText: "Called The Septic Tank Man one day and they showed up the very next day after others said it'll take 2 days to get out.", reviewCreatedAt: "2023-08-22" },
  { reviewerDisplayName: "Kimber Dawn Brouse", rating: 5, reviewText: "TJ was awesome! He even taught me how to clean my septic filter so I can save money and stress on my system.", reviewCreatedAt: "2023-08-18" },
  { reviewerDisplayName: "Alysia Holland", rating: 5, reviewText: "Septic Tank Man came out for an inspection on our home and quoted us for a repair. I called to schedule the repair and they were great.", reviewCreatedAt: "2023-08-18" },
  { reviewerDisplayName: "Teri Warren", rating: 5, reviewText: "They Are Hands down the best!! TJ is Awesome! he was very informative.", reviewCreatedAt: "2023-06-29" },
  { reviewerDisplayName: "amanda appia", rating: 5, reviewText: "TJ did a fantastic job, he explained everything he was doing to me and answered all my questions, I would use them again.", reviewCreatedAt: "2023-06-16" },
  { reviewerDisplayName: "John B", rating: 5, reviewText: "We contacted them for a pump out. They got us on the schedule the following day and they arrived when they said they would.", reviewCreatedAt: "2023-05-29" },
  { reviewerDisplayName: "cc4niner", rating: 5, reviewText: "Imagine your Friday night all of a sudden requires an emergency septic cleaning. They came out and saved the day.", reviewCreatedAt: "2023-05-20" },
  { reviewerDisplayName: "John Kotuby", rating: 5, reviewText: "Septic Tank Man did a pump out and filter clean and inlet toilet paper clog removal. TJ, the service tech they sent, was excellent.", reviewCreatedAt: "2023-04-27" },
  { reviewerDisplayName: "Vanessa Webb", rating: 5, reviewText: "TJ came to help me with an issue I was having and explained everything he was doing. TJ was very professional and nice.", reviewCreatedAt: "2023-04-21" },
  { reviewerDisplayName: "Cindy Plume", rating: 5, reviewText: "We had an issue with our septic tank and called Septic Tank Man, they sent TJ out the next morning and he was great!", reviewCreatedAt: "2023-03-31" },
  { reviewerDisplayName: "Mary Flynn", rating: 5, reviewText: "Quick and efficient", reviewCreatedAt: "2023-03-03" },
  { reviewerDisplayName: "Michael", rating: 5, reviewText: "Big thank you to TJ and Joel. They did a great job, they were on time and the price was good also.", reviewCreatedAt: "2023-03-02" },
  { reviewerDisplayName: "Alan Stier", rating: 5, reviewText: "After calling Septic Tank Man for my 2nd septic service, they did an excellent job and were professional throughout.", reviewCreatedAt: "2023-02-17" },
  { reviewerDisplayName: "Dewey Daniel", rating: 5, reviewText: "They are great! I have never had another problem since they replaced my drain field.", reviewCreatedAt: "2022-11-23" },
  { reviewerDisplayName: "Andrew Spargur", rating: 5, reviewText: "They were here quickly and did a thorough job. Professional service even though I wasn't thrilled about needing septic work.", reviewCreatedAt: "2022-07-05" },
  { reviewerDisplayName: "Sharon Porter", rating: 5, reviewText: "They take care of our system. Very nice company.", reviewCreatedAt: "2022-07-01" },
  { reviewerDisplayName: "Renee Wilson", rating: 5, reviewText: "I called and left a voicemail on Friday and they got back to me quickly. Great service from start to finish.", reviewCreatedAt: "2022-01-10" },
  { reviewerDisplayName: "David Mineo", rating: 5, reviewText: "Very helpful... We were the last customer of the day. They helped in more ways than just one here.", reviewCreatedAt: "2021-11-29" },
  { reviewerDisplayName: "Karl Swan", rating: 5, reviewText: "What a wonderful company to do business with. Would highly recommend and will use them again.", reviewCreatedAt: "2021-11-05" },
  { reviewerDisplayName: "Jared Bohager", rating: 5, reviewText: "Despite being so busy they fit me in quick and got the job done at a great price. I highly recommend them.", reviewCreatedAt: "2021-09-27" },
  { reviewerDisplayName: "Sally Pinches", rating: 5, reviewText: "We had Septic Tank Man come to pump out our septic on 5/22/21. They arrived on time - very courteous - did a great job.", reviewCreatedAt: "2021-04-23" },
  { reviewerDisplayName: "Carolina Russell", rating: 5, reviewText: "I used them a couple times. Couple months ago received an estimate from them for extension of leech field. Great service.", reviewCreatedAt: "2021-04-19" },
  { reviewerDisplayName: "Colleen Meade", rating: 5, reviewText: "Great service and prices.", reviewCreatedAt: "2021-03-15" },
  { reviewerDisplayName: "Robert Zopp", rating: 5, reviewText: "I live in Baltimore MD and my wife and I are buying a house in North Port Fl. Septic Tank Man helped us with our inspection.", reviewCreatedAt: "2021-03-09" },
  { reviewerDisplayName: "mike dukan", rating: 5, reviewText: "We had our tank drained and it was the best price around the area. The technician was professional and courteous.", reviewCreatedAt: "2021-02-25" },
  { reviewerDisplayName: "Waylon Dressel", rating: 5, reviewText: "Best septic company in the state!", reviewCreatedAt: "2021-02-23" },
  { reviewerDisplayName: "Jason Trefil", rating: 5, reviewText: "They emptied my septic tank professionally. Good communication and fair pricing.", reviewCreatedAt: "2021-01-13" },
  { reviewerDisplayName: "Sharon Rocher", rating: 5, reviewText: "Septic Tank Man was heaven sent. Don't hesitate to call them for service. They are a family owned business.", reviewCreatedAt: "2020-12-11" },
  { reviewerDisplayName: "Tommy Fraccalvieri", rating: 5, reviewText: "Best guy to call when you have a problem!", reviewCreatedAt: "2020-12-09" },
  { reviewerDisplayName: "Carrie rhoades", rating: 5, reviewText: "I had my septic system pumped out 2 years ago by another company and it backed up. They are awesome and very informative!!", reviewCreatedAt: "2020-12-05" },
  { reviewerDisplayName: "joyce sobczyk", rating: 5, reviewText: "Had a great experience with the two young guys that came out to check a septic tank for an inspection. They were professional.", reviewCreatedAt: "2020-11-24" },
  { reviewerDisplayName: "Marie Norton", rating: 5, reviewText: "Wonderful company! We had a new septic tank installed this past June. Septic Tank Man provided a fair and honest quote.", reviewCreatedAt: "2020-11-14" },
  { reviewerDisplayName: "Jordan Janeiro", rating: 5, reviewText: "Originally left 1 star due to not getting a response, but this time they were responsive and did an excellent job.", reviewCreatedAt: "2020-10-30" },
  { reviewerDisplayName: "Kev N", rating: 5, reviewText: "What a pleasure dealing with this company. Easy to schedule an appointment, the service tech called a few minutes out.", reviewCreatedAt: "2020-09-25" },
  { reviewerDisplayName: "Melina Frederick", rating: 5, reviewText: "Not only did they respond to email but they responded to text. Loved this because I was working and could not take calls.", reviewCreatedAt: "2020-09-02" },
  { reviewerDisplayName: "Izzy Torres", rating: 5, reviewText: "By far the best pricing and services in town, Thank you Slade !! 100 % recommended", reviewCreatedAt: "2020-08-26" },
  { reviewerDisplayName: "Danielle Whiteaker", rating: 5, reviewText: "Highly recommended! Plus they have the coolest looking trucks around!!", reviewCreatedAt: "2020-07-10" },
  { reviewerDisplayName: "Eniko Jarmer", rating: 5, reviewText: "Called Septic Tank Man Friday get scheduled for Tuesday for an annual pump out. Great communication and service.", reviewCreatedAt: "2020-06-17" },
  { reviewerDisplayName: "Alberto Gonzalez", rating: 5, reviewText: "I could not be happier with the professionalism that Mr. Slade showed us. Slade is very professional and knowledgeable.", reviewCreatedAt: "2020-05-21" },
  { reviewerDisplayName: "Tracy Russett", rating: 5, reviewText: "Very nice, quick reliable. Number 1 in the number 2 business.", reviewCreatedAt: "2020-05-11" },
  { reviewerDisplayName: "Jess Chua", rating: 5, reviewText: "Very prompt, professional, and reliable. Diagnosed the issue quickly and gave us peace of mind. Got to our home within a few hours.", reviewCreatedAt: "2020-05-06" },
  { reviewerDisplayName: "Tara Rajala", rating: 5, reviewText: "Excellent and prompt service. Came out next morning after I called regarding problems with my system. Very knowledgeable.", reviewCreatedAt: "2020-04-18" },
  { reviewerDisplayName: "Dirk Johnson", rating: 5, reviewText: "The gentleman Joel that came to pump my septic was very professional. I had questions and Joel answered all of them.", reviewCreatedAt: "2020-04-16" },
  { reviewerDisplayName: "Nelson Seelye", rating: 5, reviewText: "Had them come and pump out my tank yesterday did a great job. Professional and thorough.", reviewCreatedAt: "2020-04-07" },
  { reviewerDisplayName: "Lesley Miles Waite", rating: 5, reviewText: "We couldn't have been happier with the service we received. Professional, friendly, and competitively priced!", reviewCreatedAt: "2020-03-30" },
  { reviewerDisplayName: "Valhalla MMA", rating: 5, reviewText: "We would like to extend our 5 star appreciation, in response to your fantastic service.", reviewCreatedAt: "2020-03-19" },
  { reviewerDisplayName: "Jim Gouvellis", rating: 5, reviewText: "They showed up on time and did a great job. I would recommend them to anyone. Prompt, reliable and professional.", reviewCreatedAt: "2020-03-04" },
  { reviewerDisplayName: "Tim Carter", rating: 5, reviewText: "I moved to North Port in 1987 and its nice to have a company like septic tank man that is reliable and trustworthy.", reviewCreatedAt: "2020-02-11" },
  { reviewerDisplayName: "Jessica Smith", rating: 5, reviewText: "We're in the process of purchasing a new home and Sydney and Slade Copeland of Septic Tank Man could not have been more helpful.", reviewCreatedAt: "2020-01-16" },
  { reviewerDisplayName: "You Too", rating: 5, reviewText: "We had never had to have a septic pump out in decades of several Florida home ownings. They made the process easy.", reviewCreatedAt: "2020-01-15" },
];

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function launchReviewsToCsv(reviews: LaunchReviewSeed[] = LAUNCH_GOOGLE_REVIEWS): string {
  const header = "reviewer_name,rating,review_text,review_date,source";
  const lines = reviews.map(
    (review) =>
      [
        csvEscape(review.reviewerDisplayName),
        String(review.rating),
        csvEscape(review.reviewText),
        review.reviewCreatedAt,
        "google_manual",
      ].join(","),
  );
  return [header, ...lines].join("\n") + "\n";
}
