# Chapter 2: Perfectly Secret Encryption

结束了第一章关于密码学哲学基础和历史回顾的学习，我们正式进入现代密码学的第一个主题：**完善保密(perfect secrecy)**，它是密码学中一个非常重要的概念，描述了一个加密方案在理论上达到的最高安全水平.

## Perfect Secrecy

在第一章中提出了一个问题："What should a secure encryption scheme guarantee?" 以及一个简单的答案："It should guarantee that the ciphertext reveals no information about the plaintext." 这实际上就是本节要介绍的完善保密的定义. 我们将其形式化：

::: thm Definition 2.3: Perfect Secrecy
对于消息空间为 $\mathcal{M}$ 的加密方案 $(\text{Gen}, \text{Enc}, \text{Dec})$，设 $M$ 和 $C$ 分别表示消息和密文的随机变量. 如果对于 $M$ 的任何分布，$\forall\, m \in \mathcal{M}$ 和 $\forall\, c \in \mathcal{C}$ 且 $\Pr[C=c] > 0$，满足 $\Pr[M=m|C=c] = Pr[M=m]$ 成立，那么我们称该加密方案是完善保密的. 

换句话说，给定一个密文 $c$，攻击者没有任何关于明文 $m$ 的额外信息（也就是后验概率等于先验概率），那么该加密方案就是完善保密的.
:::

不难看出，使用该定义离不开的式子就是 
$$\Pr[M=m|C=c] \cdot \Pr[C=c] = \Pr[M=m, C=c] = \Pr[C=c|M=m] \cdot \Pr[M=m], $$
与完善保密的定义结合可以得到等价条件：$\Pr[C=c|M=m] = \Pr[C=c]$. 我们用这个式子来证明完善保密的另一个等价定义：

::: thm Equivalent Definition: Perfect Secrecy
消息空间为 $\mathcal{M}$ 的加密方案 $(\text{Gen}, \text{Enc}, \text{Dec})$ 是完善保密的当且仅当对 $\forall\, m, m' \in \mathcal{M}$ 和 $\forall\, c \in \mathcal{C}$，满足 $\Pr[\text{Enc}_K(m) = c] = \Pr[\text{Enc}_K(m') = c]$，这里 $K$ 表示生成密钥的随机变量，概率的计算既基于 $K$ 的分布，也基于 $\text{Enc}$ 的随机性.
:::

::: proof collapse 等价性证明

必要性：注意到对于任意的加密方案，
$$\Pr[C=c|M=m] = \Pr[\text{Enc}_K(M) = c | M=m] = \Pr[\text{Enc}_K(m) = c],$$
结合完善保密定义推出的等价条件可得 $\Pr[\text{Enc}_K(m) = c] = \Pr[C=c]$，同样的式子对于任意 $m' \in \mathcal{M}$ 也成立，因此 $\Pr[\text{Enc}_K(m) = c] = \Pr[\text{Enc}_K(m') = c]$. 充分性得证.

充分性：若 $\Pr[M=m] > 0$，我们设 $\Pr[C=c|M=m] = \Pr[\text{Enc}_K(m) = c]=p_c$，则由条件，对于任意 $m' \in \mathcal{M}$，$\Pr[C=c|M=m'] = \Pr[\text{Enc}_K(m') = c] = p_c$，从而由全概率公式：
$$ \begin{aligned} \Pr[C=c] &= \sum_{m \in \mathcal{M}} \Pr[C=c|M=m] \cdot \Pr[M=m] \\
&= p_c \sum_{m \in \mathcal{M}} \Pr[M=m] = p_c = \Pr[C=c|M=m]. \end{aligned} $$

由此可得 $\Pr[M=m|C=c] = \Pr[M=m]$. 若 $\Pr[M=m] = 0$，显然 $\Pr[M=m|C=c] = \Pr[M=m] = 0$，两种情况都满足完善保密的定义. 必要性得证. 

:::

这一条件的含义也很明确：如果一个加密方案满足完善保密，那么对于任意两个消息 $m$ 和 $m'$，它们被加密成同一个密文 $c$ 的概率必须相同. 这也符合我们对完善保密的直觉：如果某个消息比另一个消息更有可能被加密成某个特定的密文，那么攻击者就可以利用这个信息来推断出明文的一些信息，从而违反了完善保密的定义.

## Perfect (adversarial) Indistinguishability

完善保密的定义虽然很清晰，但在分析复杂的交互式协议时却显得难以操作，因为它要求对于所有可能的消息分布都满足条件. 因此，我们引入了一个更实用的概念：**完善（对抗）不可区分性(perfect (adversarial) indistinguishability)**，以及与它密切相关的实验：**对抗不可区分性实验(adversarial indistinguishability experiment)**.

::: thm Definition: Adversarial Indistinguishability Experiment $\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}$

令 $\Pi = (\text{Gen}, \text{Enc}, \text{Dec})$ 是一个消息空间为 $\mathcal{M}$ 的加密方案，$\mathcal{A}$ 是一个攻击者算法. 对抗不可区分性实验 $\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}$ 定义如下：

1. 准备阶段：攻击者 $\mathcal{A}$ 选择两个内容不同的明文（Plaintext）$m_0, m_1 \in \mathcal{M}$，并将它们提交给实验者.
2. 挑战阶段：实验者随机选择一个比特 $b \in \{0, 1\}$，并使用密钥生成算法 $\text{Gen}$ 生成一个密钥 $k$. 然后，实验者计算挑战密文(challenge ciphertext) $c \leftarrow \text{Enc}_k(m_b)$ 并将其发给 $\mathcal{A}$.
3. 猜测阶段：攻击者 $\mathcal{A}$ 接收到密文 $c$ 后，输出一个猜测 $b' \in \{0, 1\}$，试图猜测 $b$ 的值.
4. 判定阶段：如果 $b' = b$，则称攻击者则成功区分了两个明文，实验返回 1，否则返回 0.

:::

::: thm Definition 2.6: Perfect (Adversarial) Indistinguishability

对于一个消息空间为 $\mathcal{M}$ 的加密方案 $\Pi$，若对所有攻击者 $\mathcal{A}$，$\Pr[\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav} = 1] = \dfrac{1}{2}$，则称该加密方案是完善（对抗）不可区分的，即攻击者在实验中成功区分两个明文的概率不超过随机猜测的水平. 这里假设攻击者 $\mathcal{A}$ 可以拥有任意的计算能力.

:::

完善不可区分性的定义表明，在对抗不可区分性实验中，攻击者无法以任何方式利用密文来区分两个不同的明文，这与完善保密的定义是等价的. 事实上，我们可以证明这一点：

::: thm Theorem: Equivalence of Perfect Secrecy and Perfect Indistinguishability
一个加密方案 $\Pi$ 是完善保密的当且仅当它是完善不可区分的.
:::

::: proof collapse 定理之证明

必要性：因为 $\Pi$ 是完善保密的，所以对于任意 $m_0, m_1 \in \mathcal{M}$ 和 $c \in \mathcal{C}$，$\Pr[\text{Enc}_K(m_0) = c] = \Pr[\text{Enc}_K(m_1) = c]$，也就是说密文 $c$ 由 $m_0$ 和 $m_1$ 生成的概率相同. 因此在对抗不可区分性实验中，攻击者选择 $b'=0$ 与选择 $b'=1$ 的成功概率相同，也就是说 $\Pr[\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav} = 1] = \dfrac{1}{2}$，充分性得证.

充分性：进行一些简单的推导：
$$ \begin{aligned} \Pr[\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav} = 1] &= \Pr[b'=b] = \Pr[b'=0|b=0]\Pr[b=0] + \Pr[b'=1|b=1]\Pr[b=1] \\
&= \dfrac{1}{2} \cdot \Pr[b'=0|b=0] + \dfrac{1}{2} \cdot \Pr[b'=1|b=1] \\
&= \dfrac{1}{2} \cdot \Pr[b'=0|b=0] + \dfrac{1}{2}(1-\Pr[b'=0|b=1]). \end{aligned} $$
因此方案是完善保密的 $\iff \Pr[b'=0|b=0] = \Pr[b'=0|b=1]$（类似的，这也等价于 $\Pr[b'=1|b=0] = \Pr[b'=1|b=1]$），而前者为攻击者观察到 $\text{Enc}_K(m_0)$ 时输出 $b'=0$ 的概率，后者为攻击者观察到 $\text{Enc}_K(m_1)$ 时输出 $b'=0$ 的概率. 

基于此我们可以反证并构造反例：如果 $\Pi$ 不是完善保密的，那么存在 $m_0, m_1 \in \mathcal{M}$ 和 $c' \in \mathcal{C}$，使得 $\Pr[\text{Enc}_K(m_0) = c'] \neq \Pr[\text{Enc}_K(m_1) = c']$，设 $b_0$ 为使得 $\Pr[\text{Enc}_K(m_{b_0})]$ 更大的那个比特. 那么我们可以构造如下攻击者 $\mathcal{A}$：在准备阶段选择 $m_0$ 和 $m_1$，在挑战阶段接收密文 $c$ 后，如果 $c = c'$ 则输出 $b' = b_0$，否则输出随机比特. 这样当 $c=c'$ 时 $\mathcal{A}$ 有大于 $\dfrac{1}{2}$ 的概率成功，当 $c \neq c'$ 时 $\mathcal{A}$ 有 $\dfrac{1}{2}$ 的概率成功，因此 $\Pr[\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav} = 1] > \dfrac{1}{2}$，与完善不可区分性的定义矛盾. 必要性得证.

:::

## One-Time Pad

一次性密码本(One-Time Pad, OTP)是一个经典的加密方案，于 1917 年由 Gilbert Vernam 提出，彼时尚没有完善保密的概念. 但在约 25 年后，Claude Shannon 引入了完善保密的定义，并证明了一次性密码本满足这一条件.

一次性密码本的原理非常简单，加密方案定义如下：

::: thm Definition: One-Time Pad
对于一次性密码本加密方案 $\Pi = (\text{Gen}, \text{Enc}, \text{Dec})$，消息空间 $\mathcal{M}$ 和密钥空间 $\mathcal{K}$ 都是 $\{0, 1\}^n$（表示长度为 $n$ 的二进制字符串），加密算法 $\text{Enc}$ 和解密算法 $\text{Dec}$ 定义如下：

- 密钥生成算法 $\text{Gen}$：随机选择一个密钥 $k \in \{0, 1\}^n$，每个密钥的概率相等，即 $\Pr[K=k] = 2^{-n}$.
- 加密算法 $\text{Enc}$：对于明文 $m \in \{0, 1\}^n$ 和密钥 $k \in \{0, 1\}^n$，计算密文 $c = m \oplus k$（其中 $\oplus$ 表示按位异或运算）.
- 解密算法 $\text{Dec}$：对于密文 $c \in \{0, 1\}^n$ 和密钥 $k \in \{0, 1\}^n$，计算明文 $m = c \oplus k$.

根据异或的性质，$m \oplus k \oplus k = m$，即 $\text{Dec}_k(\text{Enc}_k(m)) = m$，因此该方案满足正确性.
:::

根据定义容易证明一次性密码本满足完善保密的条件：

::: thm Theorem 2.10: One-Time Pad is Perfectly Secret
一次性密码本加密方案是完善保密的.
:::

::: proof collapse 定理之证明
只需要证明对于任意的消息 $m_0, m_1 \in \{0, 1\}^n$ 和密文 $c \in \{0, 1\}^n$，$\Pr[\text{Enc}_K(m_0) = c] = \Pr[\text{Enc}_K(m_1) = c]$. 显然使得 $\text{Enc}_K(m_0) = c$ 的密钥 $k = m_0 \oplus c$ 是唯一的，故 
$$\Pr[\text{Enc}_K(m_0) = c] = \Pr[K=m_0 \oplus c] = 2^{-n}.$$ 
同理
$$\Pr[\text{Enc}_K(m_1) = c] = \Pr[K=m_1 \oplus c] = 2^{-n}.$$
因此 $\Pr[\text{Enc}_K(m_0) = c] = \Pr[\text{Enc}_K(m_1) = c]$，得证.
:::

一次性密码本虽然满足完善保密的条件，并且由于数学上非常简单，因此看起来似乎是一个非常理想的方案，但其实稍加思考就发现它存在一些严重的实际问题：

- **密钥长度问题**：一次性密码本要求密钥的长度必须与消息的长度相同，这某种程度上已经失去了加密的必要性：既然我有能够安全传输这样长的密钥的秘密渠道，那么我为何不直接用这个渠道去传递等长的明文消息呢？
- **密钥重用问题**：一次性密码本正如其名，只有当密钥只使用一次时才能保证安全. 如果同一个密钥被重复使用来加密多个消息，那么攻击者就可以通过分析多个密文之间的关系来推断出一些关于明文的信息，从而导致可能的信息泄露. 
    ::: example collapse 密钥重用的危害
    例如，如果 $c_1 = m_1 \oplus k$ 和 $c_2 = m_2 \oplus k$，那么攻击者可以计算 $c_1 \oplus c_2 = m_1 \oplus m_2$，从而获得 $m_1$ 和 $m_2$ 之间的关系，这可能会泄露一些关于明文的信息. 
    
    以 ASCII 编码为例，每次我们传递一个字符，因此消息空间和密钥空间为 $\{0, 1\}^8$. 假如攻击者接收到了使用同一密钥加密得到的密文 $c_1 = 1011 \space 0111$ 和 $c_2 = 1110 \space 0111$，那么攻击者可以计算 $c_1 \oplus c_2 = m_1 \oplus m_2 = 0101 \space 0000$. 如果传递的字符是英文字符（A-Z, a-z）或空格，那么根据它们的 ASCII 编码的特点可知两个字符中必定有一个是空格，然后分别假设 $m_1$ 和 $m_2$ 中的一个是空格就可以推断出另一个字符.

    ![](https://ctf-wiki.org/misc/encode/figure/ascii.jpg)
    :::
    结合密钥长度问题可知，为了保证安全，必须为每个消息生成一个新的密钥，这在实际应用中是非常不方便的，因此一次性密码本虽然在理论上是完善保密的，但在实际应用中并不实用.

## Limitations of Perfect Secrecy

一次性密码本的问题实际上揭示了完善保密的重要限制：要实现完善保密，必须满足密钥长度至少与消息长度相同的条件，以及加密时必须为每个消息生成一个新的密钥. 具体来说：

::: thm Theorem 2.11: Key Length Requirement and One-Time Use for Perfect Secrecy
对于一个消息空间为 $\mathcal{M}$ 的加密方案 $\Pi = (\text{Gen}, \text{Enc}, \text{Dec})$，如果 $\Pi$ 是完善保密的，那么密钥空间 $\mathcal{K}$ 的大小必须至少与消息空间 $\mathcal{M}$ 的大小相同，即 $|\mathcal{K}| \geq |\mathcal{M}|$，并且每次加密必须生成一个新的密钥.
:::

::: proof collapse 定理之证明
对于第一部分，证明思路其实很简单：如果密钥空间的大小小于消息空间的大小，那么就存在至少一个消息 $m$ 与 一个密文 $c$，使得对于所有的密钥 $k \in \mathcal{K}$，$\text{Dec}_k(c) \neq m$，也就是说攻击者可以通过观察密文 $c$ 来排除掉消息 $m$，从而获得关于明文的一些信息，这就违反了完善保密的定义.

具体来说，若结论不成立，即假设 $|\mathcal{K}| < |\mathcal{M}|$. 设 $c$ 为某个出现概率不为零的密文，并设
$$\mathcal{M}(c) = \{ m \in \mathcal{M} : m = \text{Dec}_k(c) \text{ for some } k \in \mathcal{K} \},$$
显然，$|\mathcal{M}(c)| \leq |\mathcal{K}| < |\mathcal{M}|$，因此存在 $m' \in \mathcal{M}$ 使得 $m' \notin \mathcal{M}(c)$，也就是说对于所有的密钥 $k \in \mathcal{K}$，$\text{Dec}_k(c) \neq m'$，从而 $\Pr[M=m'|C=c] = 0 \neq \Pr[M=m']$，与完善保密的定义矛盾，得证.

第二部分的证明也很简单：假设 $k \in \mathcal{K}$ 被用于加密两个消息 $m_1$ 和 $m_2$，且 $\text{Enc}_k(m_1) = c_1$ 和 $\text{Enc}_k(m_2) = c_2$，那么如果观察到 $c_1 = c_2$，就一定有 $m_1 = m_2$（由加密方案的正确性与 $\text{Dec}$ 的确定性可知），这实际上就泄露了关于明文的一些信息，违反了完善保密的定义，因此每次加密必须生成一个新的密钥，得证.
:::

完善保密要求 $|\mathcal{K}| \geq |\mathcal{M}|$，而由解密算法的正确性可知 $|\mathcal{C}| \geq |\mathcal{M}|$，这就意味着理论上最优的完善保密加密方案应该满足 $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$，也就是说消息空间、密钥空间和密文空间的大小都相同. 在这种情况下，我们可以得到一个非常重要的定理：香农定理(Shannon's Theorem).

::: thm Theorem 2.12: Shannon's Theorem
对于一个消息空间为 $\mathcal{M}$ 的加密方案 $\Pi = (\text{Gen}, \text{Enc}, \text{Dec})$，如果 $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$，其中 $\mathcal{M}, \mathcal{K}, \mathcal{C}$ 分别表示消息空间、密钥空间和密文空间，那么 $\Pi$ 是完善保密的当且仅当：

1. 密钥生成算法 $\text{Gen}$ 以均匀分布在 $\mathcal{K}$ 上生成密钥，即 $\Pr[K=k] = 1/|\mathcal{K}|$ 对于所有 $k \in \mathcal{K}$ 成立.
2. 对于每个消息 $m \in \mathcal{M}$ 和每个密文 $c \in \mathcal{C}$，存在唯一的密钥 $k \in \mathcal{K}$ 使得 $\text{Enc}_k(m) = c$.
:::

::: proof collapse 定理之证明

必要性：因为 $\Pi$ 是完善保密的，故对任意的 $c \in \mathcal{C}$，存在 $m^* \in \mathcal{M}$ 使得 $\Pr[\text{Enc}_K(m^*) = c] > 0$，由完善保密的等价定义可知 $\Pr[\text{Enc}_K(m) = c] > 0$ 对于任意 $m \in \mathcal{M}$ 都成立. 设 $\mathcal{M} = \{ m_1, m_2, \ldots \}$，则对于每个 $m_i \in \mathcal{M}$，存在至少一个密钥 $k \in \mathcal{K}$ 使得 $\text{Enc}_k(m_i) = c$，设这样的密钥构成集合 $\mathcal{K}_i$. 不难看出对于任意 $i \neq j$，$\mathcal{K}_i \cap \mathcal{K}_j = \emptyset$，否则存在 $k \in \mathcal{K}$ 使得 $\text{Enc}_k(m_i) = c$ 和 $\text{Enc}_k(m_j) = c$ 同时成立，由加密方案的正确性可知 $\text{Dec}_k(c) = m_i$ 和 $\text{Dec}_k(c) = m_j$ 同时成立，矛盾. 因此 $|\mathcal{K}| = \sum |\mathcal{K}_i|$. 因为 $|\mathcal{M}| = |\mathcal{K}|$，因此 $|\mathcal{K}_i|=1$，也就是对于每个 $m \in \mathcal{M}$ 和每个 $c \in \mathcal{C}$，存在唯一的密钥 $k \in \mathcal{K}$ 使得 $\text{Enc}_k(m) = c$. 

结合完善保密的等价定义可知

$$ \Pr[K=k_i] = \Pr[\text{Enc}_K(m_i) = c] = \Pr[\text{Enc}_K(m_j) = c] = \Pr[K=k_j]. $$

对任意的 $i,j \in \{1, 2, \ldots |\mathcal{K}|\}$ 成立，因此不难得知 $\Pr[K=k] = 1/|\mathcal{K}|$ 对于所有 $k \in \mathcal{K}$ 成立，必要性得证.

充分性：由这两个条件可以立刻得到 $\Pr[\text{Enc}_K(m) = c] = \Pr[K=k] = 1/|\mathcal{K}|$ 对于任意 $m \in \mathcal{M}$ 和 $c \in \mathcal{C}$ 成立，因此 $\Pi$ 是完善保密的，充分性得证.

:::

香农定理确实是一个检验加密方案是否满足完善保密的非常有用的工具，但是它的使用条件也非常苛刻：要求消息空间、密钥空间和密文空间的大小都相同. 因此在实际应用中，我们很难找到满足这些条件的加密方案，因此我们需要放宽完善保密的定义，来适应实际应用中的需求，这些内容将在下一章中介绍.