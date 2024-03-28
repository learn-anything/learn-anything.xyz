CREATE MIGRATION m13jwiigo6a5nzm6zxb5i4ksujnksgdck4kfa2lcw6xadotzv6v2iq
    ONTO initial
{
  CREATE TYPE default::GlobalGraph {
      CREATE REQUIRED PROPERTY connections: std::json;
  };
  CREATE TYPE default::GlobalGuide {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  CREATE TYPE default::GlobalGuideSection {
      CREATE PROPERTY summary: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  ALTER TYPE default::GlobalGuide {
      CREATE MULTI LINK sections: default::GlobalGuideSection {
          ON TARGET DELETE ALLOW;
      };
  };
  CREATE TYPE default::GlobalTopic {
      CREATE MULTI LINK globalGuides: default::GlobalGuide;
      CREATE LINK latestGlobalGuide: default::GlobalGuide;
      CREATE MULTI LINK relatedTopics: default::GlobalTopic;
      CREATE PROPERTY aiSummary: std::str;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY githubLink: std::str;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY prettyName: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY redditLink: std::str;
      CREATE PROPERTY similarTopicsGraph: std::json;
      CREATE PROPERTY topicPath: std::str;
      CREATE PROPERTY topicSummary: std::str;
      CREATE PROPERTY topicSummaryShort: std::str;
      CREATE PROPERTY topicWebsiteLink: std::str;
      CREATE REQUIRED PROPERTY verified: std::bool;
      CREATE PROPERTY wikipediaLink: std::str;
      CREATE PROPERTY xLink: std::str;
  };
  CREATE TYPE default::RelatedLink {
      CREATE PROPERTY title: std::str;
      CREATE PROPERTY url: std::str;
  };
  CREATE TYPE default::GlobalLink {
      CREATE LINK mainTopic: default::GlobalTopic;
      CREATE MULTI LINK relatedLinks: default::RelatedLink;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY fullUrl: std::str;
      CREATE REQUIRED PROPERTY protocol: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY url: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY urlTitle: std::str;
      CREATE REQUIRED PROPERTY verified: std::bool;
      CREATE PROPERTY year: std::str;
  };
  ALTER TYPE default::GlobalGuideSection {
      CREATE MULTI LINK links: default::GlobalLink {
          CREATE PROPERTY order: std::int16;
      };
  };
  CREATE TYPE default::Link {
      CREATE LINK globalLink: default::GlobalLink {
          ON TARGET DELETE ALLOW;
      };
      CREATE MULTI LINK relatedLinks: default::RelatedLink;
      CREATE PROPERTY author: std::str;
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY timeEstimate: std::str;
      CREATE PROPERTY title: std::str;
      CREATE PROPERTY type: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
      CREATE PROPERTY urlTitle: std::str;
      CREATE PROPERTY year: std::str;
  };
  ALTER TYPE default::GlobalLink {
      CREATE MULTI LINK links := (.<globalLink[IS default::Link]);
  };
  CREATE TYPE default::PersonalLink {
      CREATE REQUIRED LINK globalLink: default::GlobalLink {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE LINK mainTopic: default::GlobalTopic;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY note: std::str;
      CREATE PROPERTY title: std::str;
  };
  CREATE TYPE default::UserGuideSection {
      CREATE MULTI LINK links: default::GlobalLink;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  ALTER TYPE default::GlobalTopic {
      CREATE MULTI LINK relatedLinks: default::GlobalLink;
  };
  CREATE TYPE default::GlobalNote {
      CREATE LINK mainTopic: default::GlobalTopic;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE PROPERTY url: std::str;
  };
  CREATE TYPE default::Note {
      CREATE PROPERTY additionalContent: std::str;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY url: std::str;
  };
  ALTER TYPE default::GlobalTopic {
      CREATE MULTI LINK relatedNotes: default::Note;
  };
  CREATE TYPE default::Topic {
      CREATE LINK globalTopic: default::GlobalTopic;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE MULTI LINK mentionedTopics: default::Topic;
      CREATE LINK parentTopic: default::Topic;
      CREATE MULTI LINK topicBacklinks: default::Topic;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY prettyName: std::str;
      CREATE PROPERTY public: std::bool;
      CREATE REQUIRED PROPERTY published: std::bool;
      CREATE PROPERTY topicAsMarkdown: std::str;
      CREATE PROPERTY topicPath: std::str;
  };
  CREATE TYPE default::UserGuide {
      CREATE REQUIRED LINK globalTopic: default::GlobalTopic;
      CREATE MULTI LINK sections: default::UserGuideSection;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  CREATE TYPE default::Product {
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY imageUrl: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY priceInUsdCents: std::int16;
      CREATE PROPERTY websiteUrl: std::str;
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK topicsLearned: default::GlobalTopic;
      CREATE MULTI LINK topicsLearning: default::GlobalTopic;
      CREATE MULTI LINK topicsModerated: default::GlobalTopic;
      CREATE MULTI LINK topicsToLearn: default::GlobalTopic;
      CREATE PROPERTY topicsTracked := (((std::count(.topicsToLearn) + std::count(.topicsLearning)) + std::count(.topicsLearned)));
      CREATE MULTI LINK likedNotes: default::Note;
      CREATE MULTI LINK linksBookmarked: default::PersonalLink;
      CREATE MULTI LINK linksCompleted: default::PersonalLink;
      CREATE MULTI LINK linksInProgress: default::PersonalLink;
      CREATE MULTI LINK linksLiked: default::PersonalLink;
      CREATE PROPERTY linksTracked := ((((std::count(.linksBookmarked) + std::count(.linksInProgress)) + std::count(.linksCompleted)) + std::count(.linksLiked)));
      CREATE MULTI LINK productsBought: default::Product;
      CREATE MULTI LINK productsSelling: default::Product;
      CREATE PROPERTY admin: std::bool;
      CREATE PROPERTY displayName: std::str;
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY hankoId: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY memberUntil: std::datetime;
      CREATE PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY profileImage: std::str;
      CREATE PROPERTY stripePlan: std::str;
      CREATE PROPERTY stripeSubscriptionObjectId: std::str;
      CREATE PROPERTY subscriptionStopped: std::bool;
  };
  ALTER TYPE default::Link {
      CREATE REQUIRED LINK topic: default::Topic;
  };
  ALTER TYPE default::Topic {
      CREATE MULTI LINK links := (.<topic[IS default::Link]);
  };
  ALTER TYPE default::Note {
      CREATE MULTI LINK relatedTopics: default::Topic;
      CREATE REQUIRED LINK topic: default::Topic;
  };
  ALTER TYPE default::Topic {
      CREATE MULTI LINK notes := (.<topic[IS default::Note]);
  };
  CREATE TYPE default::PersonalWiki {
      CREATE REQUIRED LINK user: default::User;
      CREATE PROPERTY topicGraph: std::json;
      CREATE PROPERTY topicSidebar: std::json;
  };
  ALTER TYPE default::Topic {
      CREATE REQUIRED LINK wiki: default::PersonalWiki;
      CREATE CONSTRAINT std::exclusive ON ((.name, .wiki));
  };
  ALTER TYPE default::PersonalWiki {
      CREATE MULTI LINK topics := (.<wiki[IS default::Topic]);
  };
  ALTER TYPE default::User {
      CREATE LINK wiki := (.<user[IS default::PersonalWiki]);
  };
  ALTER TYPE default::UserGuide {
      CREATE REQUIRED LINK user: default::User;
  };
};
