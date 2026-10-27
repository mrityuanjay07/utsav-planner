const TYPES = {
  wedding: {
    label: 'Wedding', leadWeeks: 20, tier: [3000, 8000], perGuestNote: 'Most Indian weddings land between ₹3,000 and ₹8,000 per guest across all functions.',
    cats: [
      ['venue','Venue and stay',22,20,['Is the rate per day or per function, and are tent, power and generator included?','What are the overtime charges after the cut-off hour?','How many rooms can be blocked for family at a group rate?']],
      ['food','Catering',28,12,['What is the per-plate price for veg and Jain counters, and how many live counters are included?','Can we hold a tasting before signing, and what is the buffer for extra guests?','Who handles staff, crockery and wastage?']],
      ['decor','Décor and lighting',12,12,['Can you show 3 real setups from the same venue?','What is rented and what is bought, and what do you take back?','Who clears the stage and mandap after the function?']],
      ['photo','Photography and video',8,16,['How many shooters per function and what is the delivery timeline?','Do we get raw files and a written list of must-have shots?','What is the cancellation and date-change policy?']],
      ['attire','Attire, jewellery and makeup',12,12,['What is the fitting schedule and the last date for alterations?','Is the makeup trial included and are touch-ups on the day covered?']],
      ['music','Music and entertainment',5,12,['Is the sound system, DJ and emcee in one quote?','What is the noise cut-off the venue enforces?']],
      ['ritual','Rituals and priest',2,16,['Which muhurat and how long will each ritual run?','Which items does the priest bring and which do we arrange?']],
      ['invite','Invitations and gifts',3,8,['What is the print lead time and the proof approval process?','Is a digital invite with a RSVP link cheaper for outstation guests?']],
      ['travel','Transport and logistics',3,8,['How many cars, and who is the point person for pickups?','Is there a spare vehicle for the family on the main day?']],
      ['buffer','Contingency',5,0,['Keep this untouched until the final week.']]
    ],
    steps: [
      [26,'Fix the guest-count range and total budget','Sit with both families, agree who pays for what, and write the number down.'],
      [24,'Lock the date and book the venue','Check the muhurat, exam and festival dates, and book the venue in writing.'],
      [20,'Shortlist caterer, photographer and décor','Get three quotes each. Ask for a tasting and for real work at similar venues.'],
      [16,'Book photographer and makeup artist','Good ones fill their calendars early. Pay the booking advance only against a signed note.'],
      [14,'Send save-the-dates and block hotel rooms','Outstation guests need the date before they plan leave and tickets.'],
      [12,'Finalise menu, music and décor design','Freeze the design and menu so vendors can order stock.'],
      [8,'Print and send invitations','Send physical invites to elders, digital ones to everyone else.'],
      [6,'Outfit trials and rituals list','Complete the first fitting and confirm the priest, items list and timings.'],
      [4,'Final guest list, RSVPs and seating','Chase RSVPs by phone. Plan room allocation and transport.'],
      [2,'Run sheet and vendor confirmations','Give every vendor a one-page schedule and a single contact name.'],
      [1,'Final fittings, emergency kit, payments','Prepare a kit with safety pins, medicines, chargers and cash for tips.'],
      [0,'Event day','One family member per function owns the run sheet. Everyone else enjoys it.'],
      [-1,'After the event','Settle balances, collect the media, send thank-you messages.']
    ],
    checks: [
      ['Decide first',['Total budget agreed by both families','Guest count range (minimum and maximum)','Date and muhurat confirmed','Decision-maker named for each function']],
      ['Book',['Venue and guest accommodation','Caterer with tasting done','Photographer and videographer','Décor and lighting','Makeup artist and mehendi artist','Priest and ritual items list','DJ, band or music for each function']],
      ['Guests',['Save-the-date sent','Invitations designed and printed','RSVP tracker started','Room and transport plan for outstation guests']],
      ['Final fortnight',['Run sheet shared with vendors','Final payment schedule written down','Emergency kit packed','Backup plan for rain or power cut','Cash envelopes for tips and vendors']]
    ]
  },
  birthday: {
    label: 'Birthday', leadWeeks: 6, tier: [600, 2000], perGuestNote: 'Birthday parties usually run ₹600 to ₹2,000 per guest, and less if you host at home.',
    cats: [
      ['venue','Venue or hall',20,4,['Is the booking for 2 or 3 hours, and is setup time extra?','Can we bring our own cake, snacks or decorations?','What is the rule on outside caterers?']],
      ['food','Food and cake',35,3,['What is the per-head price and the minimum guest count?','Can the cake be eggless and nut-free on request?','How is the food kept hot or cold for 3 hours?']],
      ['decor','Décor and balloons',12,3,['Is the backdrop, balloon arch and table setup in one quote?','Who removes everything after the party?']],
      ['fun','Entertainment and activities',13,4,['How many kids or adults can the activity handle at once?','How long is the act, and what is the plan if it rains?']],
      ['photo','Photography',5,3,['Is the shoot for the cake cutting alone or the whole party?','When do we receive the photos?']],
      ['gifts','Return gifts',7,2,['Can the gifts be packed by age group?','What is the lead time for personalised items?']],
      ['invite','Invitations',2,3,['A digital card plus a WhatsApp group is usually enough.']],
      ['buffer','Contingency',6,0,['Cover extra guests, extra food and overtime.']]
    ],
    steps: [
      [8,'Pick the date, guest list and budget','Check school and exam dates. Cap the list before you pick the venue.'],
      [6,'Choose venue and theme','Pick one theme the birthday person is excited about.'],
      [5,'Book cake, caterer and entertainer','Order the cake design early if it is custom.'],
      [3,'Send invitations','Ask for RSVP with a date, and ask about allergies.'],
      [2,'Order décor and return gifts','Confirm quantities against RSVPs.'],
      [1,'Confirm every booking and plan the flow','Write a two-hour schedule: arrival, games, food, cake, goodbyes.'],
      [0,'Party day','Reach the venue 90 minutes early for setup.'],
      [-1,'After the party','Pay balances and send thank-you messages with a photo.']
    ],
    checks: [
      ['Decide first',['Budget and guest cap','Date and time slot','Theme the birthday person likes']],
      ['Book',['Venue or home setup plan','Cake ordered with design','Food and snacks','Entertainer or activities','Photographer or a friend assigned']],
      ['Guests',['Invitations sent','RSVP and allergy list','Return gifts packed']],
      ['Week of',['Schedule written','Supplies bag: candles, lighter, knife, tape, bags','Backup plan for weather and late guests']]
    ]
  },
  community: {
    label: 'Community event', leadWeeks: 8, tier: [150, 600], perGuestNote: 'Community events usually run ₹150 to ₹600 per attendee, covered by contributions or sponsors.',
    cats: [
      ['venue','Venue and permissions',15,8,['Which permissions are needed (society, police, fire, sound) and who files them?','What is the deposit and the damage policy?','What is the power capacity and is there a backup?']],
      ['food','Food and water',25,4,['Is the hygiene certificate available and who inspects it?','How is queue and crowd flow handled at serving points?']],
      ['stage','Stage, sound and lights',18,6,['What is the rated power and number of mics?','Can we get a sound check an hour before the doors open?']],
      ['promo','Publicity and printing',8,6,['Which channels reach the audience: WhatsApp groups, society notice boards, local print?','What is the print turnaround for banners and posters?']],
      ['program','Programme and performers',12,6,['Is the performer fee fixed, and what is covered (travel, sound, green room)?','What is the time slot and the cancellation rule?']],
      ['safety','Volunteers and safety',8,3,['Who is the first-aid contact and where is the nearest hospital?','What is the volunteer roster and who has the master list of numbers?']],
      ['decor','Décor and signage',6,3,['Is signage clear for entry, food, washrooms and first aid?']],
      ['clean','Cleanup and waste',3,2,['Who owns waste separation and the final cleanup?']],
      ['buffer','Contingency',5,0,['Hold this for weather cover and last-minute needs.']]
    ],
    steps: [
      [12,'Define purpose, audience and committee','Write one sentence on why the event exists. Name an owner for money, programme, logistics and safety.'],
      [10,'Fix budget sources and sponsors','List contributions, sponsor asks and ticket income against expected costs.'],
      [8,'Book venue and file permissions','Start permissions early. They are the most common cause of delay.'],
      [6,'Book performers, sound and food','Confirm each vendor in writing with timing and fee.'],
      [4,'Publicity starts','Poster, WhatsApp message and a registration link go out together.'],
      [3,'Recruit and brief volunteers','Give each volunteer one role and one name to call.'],
      [2,'Final run sheet and safety plan','Write the minute-by-minute schedule and an emergency plan.'],
      [1,'Setup walk-through','Walk the venue with the committee. Check power, signs and exits.'],
      [0,'Event day','Brief the team 60 minutes before doors open.'],
      [-1,'After the event','Publish a short accounts summary and thank volunteers and sponsors.']
    ],
    checks: [
      ['Decide first',['Purpose and audience written in one line','Committee roles named','Budget sources listed']],
      ['Book and permit',['Venue booked','Permissions filed','Sound, stage and lights','Food and water','Performers confirmed']],
      ['People',['Volunteer roster','Publicity plan live','Registration or headcount method']],
      ['Final week',['Run sheet printed','First-aid kit and contact','Waste and cleanup plan','Accounts sheet ready']]
    ]
  }
};

const PRIOS = ['Food','Décor','Photography','Music and fun','Guest comfort','Keep it simple','Traditions','Low cost','Memorable moments'];

const IDEAS = [
  {t:['wedding'],kw:['sangeet','dance','music'],title:'Family sangeet in four acts',body:'Cap the sangeet at 90 minutes: two family performances, one couple act, one open floor. Rehearse in WhatsApp video clips so nobody feels put on the spot.'},
  {t:['wedding'],kw:['haldi','mehendi'],title:'Haldi and mehendi in one afternoon',body:'Merge them for close family at the home or a garden. It saves a venue day and gives better photos in daylight.'},
  {t:['wedding'],kw:['budget','cost','low cost','simple'],title:'Two-tier guest list',body:'Invite A-list guests to every function and B-list guests to the wedding and reception only. This often cuts 25 to 35 percent of catering cost.'},
  {t:['wedding'],kw:['decor','décor'],title:'Rent the structure, spend on the focal point',body:'Rent standard drapes and florals, and put the money into one hero moment: the entrance, the mandap or the stage backdrop.'},
  {t:['wedding'],kw:['food','guest comfort'],title:'Regional food counters',body:'Offer 4 to 5 regional counters instead of 20 dishes. Guests queue less, and wastage drops.'},
  {t:['wedding'],kw:['memorable','photography','traditions'],title:'Letter wall and blessing video',body:'Ask elders to record 20-second blessings and keep a table for handwritten notes. These become the best part of the album.'},
  {t:['wedding'],kw:['guest comfort'],title:'Welcome kits for outstation guests',body:'A kit with a map, schedule, water, a snack and the contact of one coordinator saves hundreds of phone calls.'},
  {t:['birthday'],kw:['kid','child','school','theme'],title:'One theme, three activities',body:'Choose a theme and run three 20-minute stations: craft, a game and a treasure hunt. Kids stay engaged without a paid entertainer.'},
  {t:['birthday'],kw:['surprise','milestone','50','60','40'],title:'Memory timeline surprise',body:'Collect 10 photos and one line from friends and family. Show them as a slideshow or a printed string of photos at the venue.'},
  {t:['birthday'],kw:['budget','cost','low cost','simple'],title:'Terrace or home party with a hired helper',body:'A rented sound box, balloons and a caterer for snacks usually costs half of a hall. Add a rain plan.'},
  {t:['birthday'],kw:['food','cake'],title:'Cake plus a dessert table',body:'Choose a medium cake and add cupcakes or mithai in small boxes. Fewer leftovers, easier serving.'},
  {t:['birthday'],kw:['photography','memorable'],title:'Photo corner with props',body:'Set up one backdrop with props and a friend on phone duty. It replaces a full photographer for a small party.'},
  {t:['community'],kw:['festival','garba','diwali','cultural'],title:'Rotating stage slots',body:'Give each group a 10-minute slot with a hard stop. A visible timer on stage keeps the programme on time.'},
  {t:['community'],kw:['fundraiser','donation','charity'],title:'Transparent giving board',body:'Show the target and the running total on a board, and publish a one-page expense summary after the event. Donors give more when they see the plan.'},
  {t:['community'],kw:['volunteer','crowd','safety'],title:'Colour-coded volunteer teams',body:'Give each team a bib colour: entry, food, stage, first aid. Everyone knows who to ask.'},
  {t:['community'],kw:['budget','cost','low cost','sponsor'],title:'Sponsor tiers with local shops',body:'Offer three levels: banner, stall space and stage mention. Ask 10 local businesses with a one-page brief.'},
  {t:['community'],kw:['kids','youth','family'],title:'Activity zones',body:'Create a kids zone, an elders seating area and a food zone. Crowd movement and noise stay manageable.'},
  {t:['wedding','birthday','community'],kw:['rain','weather','outdoor'],title:'Weather plan B',body:'Pick the indoor fallback now, price a tent or shade cover, and decide a cut-off time to switch. Tell vendors in advance.'},
  {t:['wedding','birthday','community'],kw:['eco','plastic','waste','green'],title:'Low-waste setup',body:'Use steel plates or compostable ones, a water station with glasses and clearly labelled waste bins.'},
  {t:['wedding','birthday','community'],kw:['photography','memorable'],title:'One shared album link',body:'Create a shared album before the event and print a QR code at the entrance. Guests upload their photos as they go.'}
];
