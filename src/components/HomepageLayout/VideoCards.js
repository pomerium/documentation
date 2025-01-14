import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';

export default function VideoMediaCard() {
  const {colorMode} = useColorMode();

  return (
    <div>
      <div>
        <Card
          sx={{
            maxWidth: 850,
            mb: 7,
            ml: 0,
          }}>
          <CardMedia
            component="iframe"
            alt="2-minute explainer video of what Pomerium is."
            height="350"
            width="100%"
            src="https://www.youtube.com/embed/WGwC9ULDnAY?rel=0"
          />
          <CardContent
            sx={{
              bgcolor: colorMode === 'dark' ? '#121212' : '',
            }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                color: colorMode === 'dark' ? '#ebedf0;' : '',
              }}>
              Pomerium Demo
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colorMode === 'dark' ? '#ebedf0;' : '',
              }}>
              Learn how Pomerium secures your apps and services in this 2-minute
              demo.
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              bgcolor: colorMode === 'dark' ? '#121212' : '',
            }}>
            <Link to="/docs/get-started/quickstart">Try Quickstart</Link>
          </CardActions>
        </Card>
      </div>
      <div>
        <Card
          sx={{
            maxWidth: 850,
            mb: 7,
            ml: 0,
          }}>
          <CardMedia
            component="iframe"
            alt="something"
            height="350"
            width="100%"
            src="https://www.youtube.com/embed/bUZUg0e3A1Y"
          />
          <CardContent
            sx={{
              bgcolor: colorMode === 'dark' ? '#121212' : '',
            }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                color: colorMode === 'dark' ? '#ebedf0;' : '',
              }}>
              Clientless Access
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colorMode === 'dark' ? '#ebedf0;' : '',
              }}>
              Learn how Pomerium simplifies access control by providing
              clientless access to users within your organization.
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card
          sx={{
            maxWidth: 850,
            mb: 7,
            ml: 0,
          }}>
          <CardMedia
            component="iframe"
            alt="something"
            height="350"
            width="100%"
            src="https://www.youtube.com/embed/3MJrNvQ7aIE"
          />
          <CardContent
            sx={{
              bgcolor: colorMode === 'dark' ? '#121212' : '',
            }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                color: colorMode === 'dark' ? '#ebedf0;' : '',
              }}>
              Continuous Verification
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colorMode === 'dark' ? '#ebedf0;' : '',
              }}>
              Learn what Continuous Verification is, how it works with Pomerium,
              and why it's important for building a Zero Trust Architecture.
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              bgcolor: colorMode === 'dark' ? '#121212' : '',
            }}>
            <Link to="/docs/capabilities/authorization">
              Go to Authorization Docs
            </Link>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
