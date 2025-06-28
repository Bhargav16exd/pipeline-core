/*
  Title : Email Payloads
  Purpose : Emails Payloads data which is send upon certain events
*/

export const otpVerificationMail = {
  subject: "Here is your one time password for Cumin.Cloud",
  body: `
        Hi {{username}},

        Here is your one time password for Cumin.Cloud

        {{otp}}

        It will expire in 5 minutes

        Cheers,
        The Pipeline Team
        `,
};
export const emailOnboardYoutuber = {
  subject: "Welcome to the Creator Dashboard – Let’s Build Your Editing Team!",
  body: `
        Hi {{username}},

        Welcome to our platform built for YouTubers like you!

        🎬 Here's what you can do:
        - Create your own editing team
        - Review videos uploaded by editors
        - One-click upload to your YouTube channel
        - Maintain full control with no token storage

        Start now and bring your vision to life with the perfect team.

        Ready to roll,
        The Pipeline Team
        `,
};

export const emailOnboardEditor = {
  subject: "Welcome Editor – Your Creative Journey Begins!",
  body: `
    Hi {{username}},

    You’ve officially joined our community of skilled editors!

    🛠 What you can do:
    - Join YouTuber teams and collaborate on real projects
    - Upload edited videos directly to their dashboards
    - Get credited when videos go live on YouTube

    Let’s create something amazing together.

    Cheers,  
    The Pipeline Team
`,
};

export const emailSignIn = {
  subject: "Login Alert – You're In!",
  body: `
    Hi {{username}},

    You’ve successfully signed in to your account.

    If this wasn’t you, please change your password immediately.

    Stay creative,  
    The Pipeline Team
    `,
};

export const emailPasswordChange = {
  subject: "Password Changed Successfully",
  body: `
    Hi {{username}},

    Your password has been updated.

    If you did not perform this action, please reset it immediately or contact support.

    Stay secure,  
    The Pipeline Team
`,
};

export const emailEditorAddedToTeam = {
  subject: "You’ve Been Added to a New Team!",
  body: `
    Hi {{username}},

    Great news! You’ve been added to the team {{teamName}}.

    👥 Collaborate with your YouTuber, upload edited videos, and be part of exciting content creation.

    Let’s make magic happen,  
    The Pipeline Team
`,
};

export const emailEditorRemovedFromTeam = {
  subject: "You’ve Been Removed from a Team",
  body: `
    Hi {{username}},

    You’ve been removed from the team {{teamName}}.

    You can still join other teams and showcase your editing skills.

    Keep editing,  
    The Pipeline Team
`,
};

export const emailEditorAddedForYoutuber = {
  subject: "New Editor Added to Your Team!",
  body: `
    Hi {{username}},

    You just added {{editorName}} to your team.

    🎥 What’s Next:
    - Your editor can now start uploading edited videos.
    - You’ll be notified when a video is ready for your review.
    - Once approved, you can upload it directly to YouTube – no token storage needed!

    Empower your team. Focus on content. We'll handle the rest.

    Keep creating,  
    The Pipeline Team
    `,
};

export const emailEditorRemovedForYoutuber = {
  subject: "Editor Removed from Your Team",
  body: `
    Hi {{username}},

    You’ve successfully removed {{editorName}} from your team.

    🗂 What This Means:
    - The editor no longer has access to your team’s workspace.
    - They can no longer upload or view any of your team’s videos.
    - You can always add new editors at any time.

    Manage your team, your way.

    Stay in control,  
    The Pipeline Team
    `,
};
