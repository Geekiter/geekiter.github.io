思路：
虽然也是在双指针，但是这一题是从后面开始遍历的。

代码：

```java

class Solution {

    public void merge(int[] nums1, int m, int[] nums2, int n) {

        int n1 = m - 1;

        int n2 = n - 1;

        int merge = m + n - 1;

        while(n1 >= 0 && n2 >= 0){

            if(nums1[n1] > nums2[n2]){

                nums1[merge--] = nums1[n1--];

            }else{

                nums1[merge--] = nums2[n2--];

            }

        }

        while(n2 >= 0){

            nums1[merge--] = nums2[n2--];

        }

    }

}

```
