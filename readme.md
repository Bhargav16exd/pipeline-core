# Pipeline

Youtubers and Editors often struggle with collaborations. Uploading videos on youtube while being in travel or in low network areas, is a mountain to climb. Sharing credentials often comes with risk of losing access to account, or channel getting hacked .

Pipeline solves all of this problems in a **single solution**. 

Pipeline is a collaboration platform, where youtubers can onboard themselves on pipeline and create a team of editors, by inviting them by some coupon code. Each editor has access to upload Videos on pipeline (our platform).

Each youtuber gets list of pending videos, those uploaded videos wait for confirmation of youtubers. Once approved, on every approval, a new google OAUTH flow is initiated, thus generating fresh credentials on every upload to youtube action. After successfull upload, tokens are dumped. We as platform dont save any credentials, thus in case, if pipeline get compromised, the clients Youtube accounts remains safe, providing extra layer of security.

### Context
Primary backend service handling all client facing APIs.

## Setup

**Prerequisites:** Node.js 18+, a MongoDB instance (local or Atlas), Google APIs Service accounts, redis .

```bash
git clone https://github.com/Bhargav16exd/pipeline-core.git
cd pipeline-core
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=pipeline

ENV=dev
DEV_ENV_ORIGIN=origin_url

CLOUD_ENABLED=true

PORT=9000

ORIGIN_URL=http://localhost:5173

JWT_SECRET=verysecretJWTSECRET

BUCKET_NAME=bucket_name

ADMIN_USERNAME=someadminusername
ADMIN_EMAIL=someadminemail
ADMIN_PASSWORD=admin@123


CLIENT_ID=client_id
CLIENT_SECRET=client_secret
REDIRECT_URL=http://localhost:9000/api/yt/oAuth2Callback

GOOGLE_APPLICATION_CREDENTIALS = some_json_file.json

YOUTUBE_UPLOAD_SCOPE=https://www.googleapis.com/auth/youtube.upload
YOUTUBE_CHANNEL_READ=https://www.googleapis.com/auth/youtube.readonly

SERVER_TO_SERVER_TOKEN=server_to_server_token

AWS_ACCESS_KEY_ID=access_key_id
AWS_SECRET_ACCESS_KEY=secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=bucket_name

GOOGLE_APP_PASSWORD=system_password
SYSTEM_EMAIL=system@pipeline.com

SALT=random_salt
COUPON_SECRET=some_secret
```

Run it:

```bash
npm run dev
```

## More Technical Details are available here :  
```bash
https://app.notion.com/p/Projects-39072e56834880f8a442c07055654eec
```

## Author

Built by [**Bhargav16exd**](https://github.com/Bhargav16exd). Issues and PRs welcome if something looks off.