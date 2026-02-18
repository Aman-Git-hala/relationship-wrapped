export const fakeData = {
    meta: {
        total_messages: 14283,
        start_date: "2023-05-14",
        end_date: "2024-05-14"
    },
    wrapped: {
        sweetest: [
            { message: "You are my favorite notification.", timestamp: "2023-06-12 10:45:00", sender: "Him" },
            { message: "I just saw a dog that looked like you (cute).", timestamp: "2023-07-01 14:20:00", sender: "Her" },
            { message: "Can we just skip to the part where we are watching movies?", timestamp: "2023-08-15 19:30:00", sender: "Him" },
            { message: "You make everything better, even Mondays.", timestamp: "2023-09-10 09:15:00", sender: "Her" },
            { message: "I saved you a piece of cake. Actually two.", timestamp: "2023-10-05 20:00:00", sender: "Him" },
            { message: "Stop being so adorable, it's distracting.", timestamp: "2023-11-20 11:11:00", sender: "Her" },
            { message: "I had a dream about us and it was perfect.", timestamp: "2023-12-25 08:30:00", sender: "Him" },
            { message: "You turn my chaos into peace.", timestamp: "2024-01-14 22:45:00", sender: "Her" },
            { message: "Every time my phone buzzes I hope it's you.", timestamp: "2024-02-14 00:01:00", sender: "Him" },
            { message: "I love you more than coffee. And that is saying a lot.", timestamp: "2024-03-10 07:45:00", sender: "Her" }
        ],
        funniest: [
            { message: "I think I just ate a bug.", timestamp: "2023-06-15 12:30:00", sender: "Him" },
            { message: "Why are you like this?", timestamp: "2023-07-20 16:45:00", sender: "Her" },
            { message: "I tripped walking UP the stairs.", timestamp: "2023-08-05 18:20:00", sender: "Him" },
            { message: "Send help, trapped under cat.", timestamp: "2023-09-12 14:10:00", sender: "Her" },
            { message: "I attempted cooking. Fire department not involved (yet).", timestamp: "2023-10-30 19:00:00", sender: "Him" },
            { message: "Did you just hiss at me?", timestamp: "2023-11-15 21:30:00", sender: "Her" },
            { message: "I'm not asleep, I'm resting my eyes loudly.", timestamp: "2023-12-01 23:00:00", sender: "Him" },
            { message: "Your plant died. I tried CPR. It didn't work.", timestamp: "2024-01-10 10:00:00", sender: "Her" },
            { message: "I bought more snacks. Don't ask where the money went.", timestamp: "2024-02-05 15:45:00", sender: "Him" },
            { message: "If you don't reply in 5 seconds I'm eating your fries.", timestamp: "2024-03-20 13:00:00", sender: "Her" }
        ],
        timeline: [
            { month_year: "May 2023", count: 450 },
            { month_year: "Jun 2023", count: 1200 },
            { month_year: "Jul 2023", count: 1800 },
            { month_year: "Aug 2023", count: 1500 },
            { month_year: "Sep 2023", count: 1600 },
            { month_year: "Oct 2023", count: 1400 },
            { month_year: "Nov 2023", count: 1900 },
            { month_year: "Dec 2023", count: 2200 },
            { month_year: "Jan 2024", count: 1700 },
            { month_year: "Feb 2024", count: 1300 },
            { month_year: "Mar 2024", count: 1500 },
            { month_year: "Apr 2024", count: 1600 }
        ]
    },
    search_index: Array.from({ length: 150 }).map((_, i) => ({
        message: [
            "Missing you!", "Good morning sunshine", "What's for dinner?", "Haha you're funny",
            "Love you!", "Can't wait to see you", "Did you see that meme?", "On my way!",
            "Thinking of you", "How was work?", "OMG guess what", "So tired...", "Movie night?",
            "You're the best", "Call me?", "Just saw this and thought of you", "Sleep well",
            "Good night <3", "Hey!!!", "Remember when..."
        ][i % 20],
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString(),
        sender: i % 2 === 0 ? "Him" : "Her",
        emotion: ["love", "happy", "funny", "neutral", "sad", "excited"][i % 6]
    }))
};
