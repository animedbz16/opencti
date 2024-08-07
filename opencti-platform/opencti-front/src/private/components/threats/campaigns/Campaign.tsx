import React from 'react';
import { graphql, useFragment } from 'react-relay';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import CampaignDetails from './CampaignDetails';
import CampaignEdition from './CampaignEdition';
import Security from '../../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import StixCoreObjectOrStixCoreRelationshipNotes from '../../analyses/notes/StixCoreObjectOrStixCoreRelationshipNotes';
import StixDomainObjectOverview from '../../common/stix_domain_objects/StixDomainObjectOverview';
import StixCoreObjectExternalReferences from '../../analyses/external_references/StixCoreObjectExternalReferences';
import StixCoreObjectLatestHistory from '../../common/stix_core_objects/StixCoreObjectLatestHistory';
import SimpleStixObjectOrStixRelationshipStixCoreRelationships from '../../common/stix_core_relationships/SimpleStixObjectOrStixRelationshipStixCoreRelationships';
import { Campaign_campaign$key } from './__generated__/Campaign_campaign.graphql';
import StixCoreObjectOrStixRelationshipLastContainers from '../../common/containers/StixCoreObjectOrStixRelationshipLastContainers';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles(() => ({
  gridContainer: {
    marginBottom: 20,
  },
}));

const campaignFragment = graphql`
  fragment Campaign_campaign on Campaign {
    id
    standard_id
    entity_type
    x_opencti_stix_ids
    spec_version
    revoked
    confidence
    created
    modified
    created_at
    updated_at
    createdBy {
      ... on Identity {
        id
        name
        entity_type
        x_opencti_reliability
      }
    }
    creators {
      id
      name
    }
    objectMarking {
      id
      definition_type
      definition
      x_opencti_order
      x_opencti_color
    }
    objectLabel {
      id
      value
      color
    }
    name
    aliases
    status {
      id
      order
      template {
        name
        color
      }
    }
    workflowEnabled
    ...CampaignDetails_campaign
  }
`;

const CampaignComponent = ({
  campaign,
}: {
  campaign: Campaign_campaign$key;
}) => {
  const campaignData = useFragment(campaignFragment, campaign);
  const classes = useStyles();
  return (
    <>
      <Grid
        container={true}
        spacing={3}
        classes={{ container: classes.gridContainer }}
      >
        <Grid item xs={6}>
          <CampaignDetails campaign={campaignData} />
        </Grid>
        <Grid item xs={6}>
          <StixDomainObjectOverview stixDomainObject={campaignData} />
        </Grid>
        <Grid item xs={6}>
          <SimpleStixObjectOrStixRelationshipStixCoreRelationships
            stixObjectOrStixRelationshipId={campaignData.id}
            stixObjectOrStixRelationshipLink={`/dashboard/threats/campaigns/${campaignData.id}/knowledge`}
          />
        </Grid>
        <Grid item xs={6}>
          <StixCoreObjectOrStixRelationshipLastContainers
            stixCoreObjectOrStixRelationshipId={campaignData.id}
          />
        </Grid>
        <Grid item xs={6}>
          <StixCoreObjectExternalReferences
            stixCoreObjectId={campaignData.id}
          />
        </Grid>
        <Grid item xs={6}>
          <StixCoreObjectLatestHistory stixCoreObjectId={campaignData.id} />
        </Grid>
      </Grid>
      <StixCoreObjectOrStixCoreRelationshipNotes
        stixCoreObjectOrStixCoreRelationshipId={campaignData.id}
        defaultMarkings={campaignData.objectMarking ?? []}
      />
      <Security needs={[KNOWLEDGE_KNUPDATE]}>
        <CampaignEdition campaignId={campaignData.id} />
      </Security>
    </>
  );
};

export default CampaignComponent;
