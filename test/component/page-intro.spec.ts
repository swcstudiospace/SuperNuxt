import { expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PageIntro from "../../app/components/PageIntro.vue";

it("renders a page intro while optional modules are off", async () => {
  const wrapper = await mountSuspended(PageIntro, {
    props: {
      kicker: "Modules",
      title: "Opt out",
      lede: "Flags remove the module.",
    },
  });
  expect(wrapper.text()).toContain("Opt out");
  expect(wrapper.text()).toContain("Flags remove the module.");
});
