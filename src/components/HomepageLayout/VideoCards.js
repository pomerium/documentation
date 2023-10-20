import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from '@docusaurus/Link';


export default function VideoMediaCard() {

  return (
    <div>
      <div>
      <Card sx={{
        maxWidth: 850,
        mb: 7,
        ml: 0
        }}>
        <CardMedia
          component="iframe"
          alt="2-minute explainer video of what Pomerium is."
          height="350"
          width="100%"
          src="https://www.youtube.com/embed/WGwC9ULDnAY?rel=0"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Pomerium Demo
          </Typography>
          <Typography variant="body1">
            Learn how Pomerium secures your apps and services in this 2-minute demo.
          </Typography>
        </CardContent>
        <CardActions>
          <Link to="/docs/quickstart">
            Try Quickstart
          </Link>
        </CardActions>
      </Card>
      </div>
      <div>
      <Card sx={{
        maxWidth: 850,
        mb: 7,
        ml: 0
        }}>
        <CardMedia
          component="iframe"
          alt="something"
          height="350"
          width="100%"
          src="https://www.youtube.com/embed/bUZUg0e3A1Y"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Clientless Access
          </Typography>
          <Typography variant="body1">
          Learn how Pomerium simplifies access control by providing clientless access to users within your organization.
          </Typography>
        </CardContent>
      </Card>
      </div>
      <div>
      <Card sx={{
        maxWidth: 850,
        mb: 7,
        ml: 0
        }}>
        <CardMedia
          component="iframe"
          alt="something"
          height="350"
          width="100%"
          src="https://www.youtube.com/embed/3MJrNvQ7aIE"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Continuous Verification
          </Typography>
          <Typography variant="body1">
            Learn what Continuous Verification is, how it works with Pomerium, and why it's important for building a Zero Trust Architecture.
          </Typography>
        </CardContent>
        <CardActions>
        <Link to="/docs/capabilities/authorization">
            Go to Authorization Docs
          </Link>
        </CardActions>
      </Card>
      </div>
    </div>
  )
}

