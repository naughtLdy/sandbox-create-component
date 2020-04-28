import Vue from 'vue';
import <%= component-name %> from '~/components/<%= component-name %>/index.vue';

export default {
  title: 'components/<%= component-name %>',
  component: <%= component-name %>,
};

export const Default = () =>
  Vue.extend({
    components: {
      <%= component-name %>,
    },
    template: `
      <<%= component-name %> />
    `,
  });
